import React, { useState, useRef } from 'react';
import Modal from 'components/ui/Modal';
import Button from 'components/ui/Button';
import { Textarea } from 'components/ui/Input';
import { postsApi } from 'api/posts';
import { extractError } from 'api/client';
import { Post } from 'types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (post: Post) => void;
}

export default function CreatePostModal({ isOpen, onClose, onCreated }: CreatePostModalProps) {
  const [caption, setCaption] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const arr = Array.from(selected);
    setFiles((prev) => [...prev, ...arr]);
    arr.forEach((f) => setPreviews((prev) => [...prev, URL.createObjectURL(f)]));
  };

  const reset = () => {
    setCaption(''); setTagInput(''); setTags([]); setFiles([]); setPreviews([]); setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const submit = async () => {
    if (files.length === 0) { setError('Please add at least one image or video.'); return; }
    setLoading(true); setError('');
    try {
      const post = await postsApi.createPost(caption, tags, files);
      onCreated(post);
      reset();
      onClose();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New post" maxWidth={600}>
      <div className="flex flex-col gap-5">

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          className="border-2 border-dashed border-neutral-300 rounded cursor-pointer hover:border-ink transition-colors bg-neutral-50"
        >
          {previews.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-2">
              {previews.map((p, i) => (
                <div key={i} className="relative">
                  <img src={p} alt="" className="w-20 h-20 object-cover rounded block" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFiles((prev) => prev.filter((_, j) => j !== i));
                      setPreviews((prev) => prev.filter((_, j) => j !== i));
                    }}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-ink text-white text-[10px] rounded-full flex items-center justify-center border-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="w-20 h-20 border border-dashed border-neutral-300 rounded flex items-center justify-center text-2xl text-neutral-300">
                +
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-ink-soft mb-1">Drag & drop or click to upload</p>
              <p className="text-xs text-ink-faint">Images and videos supported</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Caption */}
        <Textarea
          label="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write something about this work…"
          rows={3}
        />

        {/* Tags */}
        <div>
          <label className="text-xs font-medium text-ink tracking-wide block mb-1.5">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
              placeholder="Add tag and press Enter"
              className="flex-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
            />
            <Button variant="secondary" size="sm" onClick={addTag} type="button">Add</Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-ink text-white text-xs rounded-sm border-none cursor-pointer tracking-wider lowercase"
                >
                  #{t} <span className="text-[10px]">×</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button onClick={submit} loading={loading}>Publish</Button>
        </div>
      </div>
    </Modal>
  );
}
