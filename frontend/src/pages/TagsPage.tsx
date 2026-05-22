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
    tagsApi.getAllTags().then(setTags).finally(() => setLoading(false));
  }, []);

  const toggle = async (tag: Tag) => {
    setToggling(tag.id);
    try {
      if (tag.is_followed) await tagsApi.unfollowTag(tag.id);
      else await tagsApi.followTag(tag.id);
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

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()));
  const followedCount = tags.filter((t) => t.is_followed).length;

  return (
    <Layout narrow={false}>
      <h1 className="font-serif text-2xl font-semibold text-ink mb-1">Tags</h1>
      <p className="text-sm text-ink-muted mb-6">
        Follow tags to personalise your feed.
        {followedCount > 0 && ` You follow ${followedCount} tag${followedCount !== 1 ? 's' : ''}.`}
      </p>

      {/* Search */}
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search tags…"
        className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm outline-none focus:border-ink transition-colors mb-6"
      />

      {loading ? (
        <LoadingSpinner fullPage />
      ) : filtered.length === 0 ? (
        <EmptyState title="No tags found" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px border border-neutral-200 bg-neutral-200">
          {filtered.map((tag) => (
            <div
              key={tag.id}
              className={`flex flex-col gap-3 p-5 ${tag.is_followed ? 'bg-neutral-50' : 'bg-white'}`}
            >
              <div>
                <p className="text-sm font-semibold text-ink">#{tag.name}</p>
                <p className="text-xs text-ink-faint mt-0.5">
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
