import { useState, type FormEvent } from 'react';
import { Delete, Lock, X } from 'lucide-react';
import { loginEditorPin } from '../utils/api.ts';

interface PinAuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

const KEYPAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function PinAuthModal({
  open,
  onClose,
  onAuthenticated,
}: PinAuthModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleAppend = (digit: string) => {
    setError('');
    setPin((prev) => (prev.length < 16 ? prev + digit : prev));
  };

  const handleBackspace = () => {
    setError('');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError('Masukkan kode akses numerik.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const result = await loginEditorPin(pin);
      if (result.authenticated) {
        setPin('');
        onAuthenticated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kode akses tidak valid.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1d37]/55 backdrop-blur-[2px] p-4"
    >
      <div className="w-full max-w-sm surface-elevated rounded-[3px] p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-[#e4eefb] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[2px] bg-[#ebf2fc] border border-[#cddbf0] flex items-center justify-center text-[#1d4ed8]">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="editor-auth-title"
                className="text-base font-bold text-[#0a1d37]"
              >
                Akses Mode Editor
              </h2>
              <p className="text-xs text-[#5d7699]">
                Masukkan kode numerik administrator
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setPin('');
              setError('');
              onClose();
            }}
            aria-label="Tutup dialog akses"
            className="w-8 h-8 rounded-[2px] flex items-center justify-center text-[#5d7699] hover:text-[#0a1d37] hover:bg-[#ebf2fc] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="editor-pin-input"
              className="block text-xs font-semibold text-[#334e73] mb-1.5"
            >
              Kode Akses Numerik
            </label>
            <input
              id="editor-pin-input"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              value={pin}
              onChange={(e) => {
                setError('');
                setPin(e.target.value.replace(/[^0-9]/g, ''));
              }}
              placeholder="••••••••••"
              className="w-full h-11 px-3.5 rounded-[2px] bezel-recessed font-serif text-lg tracking-[0.25em] text-[#0a1d37] focus:outline-2 focus:outline-[#1d4ed8]"
            />
          </div>

          <div
            className="bezel-recessed rounded-[2px] p-2.5 grid grid-cols-3 gap-2"
            aria-label="Papan tombol numerik"
          >
            {KEYPAD_DIGITS.map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleAppend(digit)}
                className="h-11 rounded-[2px] pin-key font-sans text-sm font-semibold text-[#0a1d37] tabular-nums"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPin('');
                setError('');
              }}
              className="h-11 rounded-[2px] pin-key text-xs font-semibold text-[#456084]"
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={() => handleAppend('0')}
              className="h-11 rounded-[2px] pin-key font-sans text-sm font-semibold text-[#0a1d37] tabular-nums"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              aria-label="Hapus satu digit"
              className="h-11 rounded-[2px] pin-key flex items-center justify-center text-[#456084]"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="text-xs font-medium text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca] rounded-[2px] px-3 py-2"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-[2px] text-xs font-semibold text-[#334e73] btn-tactile-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-[2px] text-xs font-semibold text-white btn-tactile disabled:opacity-60"
            >
              {submitting ? 'Memverifikasi...' : 'Buka Editor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
