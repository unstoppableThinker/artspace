import React, { useState, useRef } from 'react';
import Modal from 'components/ui/Modal';
import Button from 'components/ui/Button';
import { Textarea } from 'components/ui/Input';
import TagBadge from 'components/tag/TagBadge';
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
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9\-]/g, '');
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (name: string) => setTags((prev) => prev.filter((t) => t !== name));

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const arr = Array.from(selected);
    setFiles((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const url = URL.createObjectURL(f);
      setPreviews((prev) => [...prev, url]);
    });
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Media upload */}
        <div>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: '1.5px dashed #d4d4d4', borderRadius: 4,
              padding: previews.length ? 8 : 40,
              textAlign: 'center', cursor: 'pointer',
              background: '#fafafa',
              transition: 'border-color 0.15s',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          >
            {previews.length > 0 ? (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {previews.map((p, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={p} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 3, display: 'block' }} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles((prev) => prev.filter((_, j) => j !== i));
                        setPreviews((prev) => prev.filter((_, j) => j !== i));
                      }}
                      style={{ position: 'absolute', top: 2, right: 2, background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div style={{ width: 80, height: 80, border: '1px dashed #d4d4d4', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#d4d4d4' }}>+</div>
              </div>
            ) : (
              <>
                <p style={{ margin: '0 0 4px', fontSize: 14, color: '#525252' }}>Drag & drop or click to upload</p>
                <p style={{ margin: 0, fontSize: 12, color: '#a3a3a3' }}>Images and videos supported</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

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
          <label style={{ fontSize: 13, fontWeight: 500, color: '#111', display: 'block', marginBottom: 6 }}>Tags</label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
              placeholder="Add tag and press Enter"
              style={{
                flex: 1, border: '1px solid #d4d4d4', borderRadius: 4,
                padding: '8px 10px', fontSize: 13, outline: 'none',
              }}
            />
            <Button variant="secondary" size="sm" onClick={addTag} type="button">Add</Button>
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => removeTag(t)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: 2, border: '1px solid #111',
                    background: '#111', color: '#fff', fontSize: 12, cursor: 'pointer',
                  }}
                >
                  #{t} <span style={{ fontSize: 10 }}>×</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p style={{ margin: 0, fontSize: 13, color: '#ef4444' }}>{error}</p>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button onClick={submit} loading={loading}>Publish</Button>
        </div>
      </div>
    </Modal>
  );
}
