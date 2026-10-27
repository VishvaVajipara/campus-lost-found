import { useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { resizeImage } from '../utils/helpers';

// Lets the user choose one optional photo. "value" is the photo text ('' if none).
function ImagePicker({ value, onChange }) {
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // allows choosing the same file again later
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image is too large. Please choose one under 10 MB');
      return;
    }

    setError('');
    setProcessing(true);
    try {
      onChange(await resizeImage(file));
    } catch (err) {
      setError('Could not read this image. Please try a JPG or PNG.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <span className="label">Photo (optional)</span>

      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Selected item" className="h-40 w-auto rounded-xl border border-slate-200 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 rounded-full border border-slate-200 bg-white p-1 text-slate-600 shadow hover:text-red-600"
            aria-label="Remove photo"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600">
          {processing ? <Loader2 size={22} className="animate-spin" /> : <ImagePlus size={22} />}
          {processing ? 'Preparing photo...' : 'Click to add a photo'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={processing} />
        </label>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default ImagePicker;
