import { getJson, setJson } from '../lib/storage';
import React from 'react';
import { usePremiumRealtime } from '../hooks/usePremiumRealtime';
export default function RealtimeBridge() {
  usePremiumRealtime();
  return null;
}
