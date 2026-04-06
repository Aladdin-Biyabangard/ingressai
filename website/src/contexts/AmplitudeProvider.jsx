'use client';

import { useEffect } from 'react';
import { initAmplitude } from '@/lib/amplitude';

const AmplitudeProvider = () => {
  useEffect(() => {
    initAmplitude();
  }, []);

  return null;
};

export default AmplitudeProvider;
