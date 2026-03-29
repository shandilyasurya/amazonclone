import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { useAddReviewMutation } from '../slices/reviewsApiSlice';
import { Camera, Star, X, ImageIcon, Loader2 } from 'lucide-react';

const CreateReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);
  const fileInputRef = useRef(null);

  const { data: response, isLoading } = useGetProductDetailsQuery(id);
  const [addReview, { isLoading: submitting }] = useAddReviewMutation();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [publicName] = useState(userInfo?.name || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Image upload state
  const [selectedFile, setSelectedFile] = useState(null);    // local File object for preview
  const [previewUrl, setPreviewUrl] = useState(null);        // ObjectURL for preview
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Cloudinary URL after upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const product = response?.data;
  const productImage = product?.images?.[0]?.image_url;

  // ── Handle file selection → auto-upload to Cloudinary ──
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setUploadError('Only JPEG, PNG or WebP images are supported.');
      return;
    }
    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5 MB.');
      return;
    }

    setUploadError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadedImageUrl(null);

    // Upload to Cloudinary via backend /api/upload
    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        setUploadedImageUrl(json.data.url);
      } else {
        setUploadError('Upload failed: ' + (json.message || 'Unknown error'));
      }
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedImageUrl(null);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit review ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (!title.trim()) { setError('Please provide a title for your review.'); return; }
    if (selectedFile && !uploadedImageUrl) {
      setError('Please wait for your image to finish uploading.'); return;
    }

    try {
      await addReview({
        productId: id,
        rating,
        title: title.trim(),
        body: body.trim(),
        image_url: uploadedImageUrl || undefined,
      }).unwrap();
      setSuccess(true);
      setTimeout(() => navigate(`/product/${id}`), 1800);
    } catch (err) {
      setError(err?.data?.message || 'Failed to submit review. You may have already reviewed this product.');
    }
  };

  const ratingLabels = ['', 'I hate it', "I don't like it", "It's okay", 'I like it', 'I love it'];
  const activeRating = hoverRating || rating;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif" }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="border-b border-[#ddd] pb-5 mb-6">
          <h1 className="text-[24px] font-medium text-[#0F1111] mb-4">How was the item?</h1>
          <div className="flex items-center gap-4">
            {productImage && (
              <img
                src={productImage}
                alt={product?.name}
                className="w-16 h-16 object-contain flex-shrink-0 mix-blend-multiply"
              />
            )}
            <Link
              to={`/product/${id}`}
              className="text-[14px] font-medium text-[#007185] hover:text-[#C7511F] hover:underline leading-snug"
            >
              {product?.name}
            </Link>
          </div>
        </div>

        {/* ── Success Banner ── */}
        {success && (
          <div className="bg-[#DFF2BF] border border-[#4F8A10] text-[#4F8A10] px-4 py-3 rounded mb-4 text-[14px] flex items-center gap-2">
            ✅ Review submitted! Redirecting to product page…
          </div>
        )}

        {/* ── Error Banner ── */}
        {error && (
          <div className="bg-[#FDECEA] border border-[#B12704] text-[#B12704] px-4 py-3 rounded mb-4 text-[13px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Star Rating ── */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={38}
                    fill={activeRating >= star ? '#FF9900' : 'none'}
                    stroke={activeRating >= star ? '#FF9900' : '#aaa'}
                    strokeWidth={1.5}
                    className="transition-colors"
                  />
                </button>
              ))}
            </div>
            {activeRating > 0 && (
              <p className="text-[13px] text-[#565959] mt-0.5">{ratingLabels[activeRating]}</p>
            )}
          </div>

          {/* ── Write a Review ── */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F1111] mb-2">Write a review</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="What should other customers know?"
              className="w-full border border-[#a6a6a6] rounded px-3 py-2 text-[14px] text-[#0F1111] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] resize-none"
            />
          </div>

          {/* ── Photo Upload ── */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F1111] mb-2">
              Share a photo <span className="font-normal text-[#565959]">(optional)</span>
            </label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              className="hidden"
              id="review-image-upload"
            />

            {previewUrl ? (
              // Preview state
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className={`w-32 h-32 object-cover rounded border-2 ${uploadedImageUrl ? 'border-[#4F8A10]' : 'border-[#ddd]'} transition-all`}
                />
                {/* Upload overlay spinner */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                    <Loader2 size={24} className="text-white animate-spin" />
                  </div>
                )}
                {/* Success checkmark */}
                {uploadedImageUrl && !uploading && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#4F8A10] rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                )}
                {/* Remove button */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -left-2 w-5 h-5 bg-[#555] hover:bg-[#B12704] rounded-full flex items-center justify-center transition-colors"
                  aria-label="Remove photo"
                >
                  <X size={11} className="text-white" />
                </button>
              </div>
            ) : (
              // Upload trigger area
              <label
                htmlFor="review-image-upload"
                className="flex flex-col items-center justify-center py-7 border-2 border-dashed border-[#b0b0b0] rounded bg-[#f7f8f8] cursor-pointer hover:bg-[#f0f5ff] hover:border-[#4A90E2] transition-all gap-2"
              >
                <Camera size={28} className="text-[#555]" strokeWidth={1.5} />
                <p className="text-[13px] text-[#555] font-medium">Tap to upload a photo from your device</p>
                <p className="text-[11px] text-[#999]">JPEG, PNG or WebP · Max 5 MB</p>
                <div className="mt-1 bg-white border border-[#D5D9D9] rounded-lg px-4 py-1.5 text-[12px] font-medium text-[#0F1111] shadow-sm flex items-center gap-1.5">
                  <ImageIcon size={13} /> Choose photo
                </div>
              </label>
            )}

            {uploadError && (
              <p className="text-[12px] text-[#B12704] mt-1.5">{uploadError}</p>
            )}
            {uploadedImageUrl && (
              <p className="text-[12px] text-[#4F8A10] mt-1.5">✓ Photo uploaded successfully</p>
            )}
          </div>

          {/* ── Title ── */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F1111] mb-2">
              Title your review <span className="font-normal text-[#555]">(required)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's most important to know?"
              className="w-full border border-[#a6a6a6] rounded px-3 py-2 text-[14px] text-[#0F1111] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600]"
            />
          </div>

          {/* ── Public Name ── */}
          <div>
            <label className="block text-[14px] font-bold text-[#0F1111] mb-2">
              What's your public name? <span className="font-normal text-[#555]">(required)</span>
            </label>
            <input
              type="text"
              value={publicName}
              readOnly
              className="w-full border border-[#a6a6a6] rounded px-3 py-2 text-[14px] text-[#0F1111] bg-[#f7f8f8] cursor-not-allowed"
            />
            <p className="text-[11px] text-[#555] mt-1">
              This is your account name. It will appear on your review.
            </p>
          </div>

          {/* ── Submit ── */}
          <div className="flex justify-end pb-8">
            <button
              type="submit"
              disabled={submitting || success || uploading}
              className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-medium rounded-full px-10 py-2 text-[14px] shadow-sm disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateReviewPage;
