import { getJson, setJson } from '../lib/storage';
// src/pages/PostFeed.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import LazyImage from '../components/LazyImage';

export default function PostFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('post')
      .select('*')
      .order('id', { ascending: false });
    if (!error) setPosts(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary">ðŸ“° Post recenti</h1>
      {posts.map((post) => (
        <div
          key={post.id}
          className="mb-6 border-b border-gray-700 pb-4 bg-dark p-4 rounded-xl shadow"
        >
          <h2 className="text-xl font-semibold text-light">{post.title}</h2>
          {post.image_url && (
            <div className="w-full aspect-[4/3] overflow-hidden rounded-xl my-2">
              <LazyImage
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <p className="text-gray-300">{post.content}</p>
        </div>
      ))}
    </div>
  );
}
