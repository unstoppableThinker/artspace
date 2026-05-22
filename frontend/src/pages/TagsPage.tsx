import React, { useState, useEffect } from 'react';
import { Tag } from 'types';
import { tagsApi } from 'api/tags';
import Layout from 'components/layout/Layout';
import Button from 'components/ui/Button';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import EmptyState from 'components/ui/EmptyState';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    tagsApi.getAllTags()
      .then(setTags)
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (tag: Tag) => {
    setToggling(tag.id);
    try {
      if (tag.is_followed) {
        await tagsApi.unfollowTag(tag.id);
      } else {
        await tagsApi.followTag(tag.id);
      }
      setTags((prev) =>
        prev.map((t) =>
          t.id === tag.id
            ? { ...t, is_followed: !t.is_followed, follower_count: t.follower_count + (t.is_followed ? -1 : 1) }
            : t
        )
      );
    } finally {
      setToggling(null);
    }
  };

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(filter.toLowerCase())
  );

  const followed = tags.filter((t) => t.is_followed);

  return (
    <Layout maxWidth={760}>
      <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>Tags</h1>
      <p style={{ margin: '0 0 28px', fontSize: 14, color: '#737373' }}>
        Follow tags to personalise your feed.
        {followed.length > 0 && ` You follow ${followed.length} tag${followed.length !== 1 ? 's' : ''}.`}
      </p>

      {/* Search */}
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search tags…"
        style={{
          width: '100%', border: '1px solid #e5e5e5', borderRadius: 4,
          padding: '10px 14px', fontSize: 14, outline: 'none',
          marginBottom: 24, boxSizing: 'border-box',
        }}
      />

      {loading ? (
        <LoadingSpinner fullPage />
      ) : filtered.length === 0 ? (
        <EmptyState title="No tags found" />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 1,
          border: '1px solid #e5e5e5',
        }}>
          {filtered.map((tag) => (
            <div
              key={tag.id}
              style={{
                padding: '16px 20px',
                borderRight: '1px solid #e5e5e5',
                borderBottom: '1px solid #e5e5e5',
                background: tag.is_followed ? '#fafafa' : '#fff',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}
            >
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 14 }}>#{tag.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#a3a3a3' }}>
                  {tag.follower_count} follower{tag.follower_count !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                variant={tag.is_followed ? 'secondary' : 'primary'}
                size="sm"
                loading={toggling === tag.id}
                onClick={() => toggle(tag)}
              >
                {tag.is_followed ? 'Following' : 'Follow'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
