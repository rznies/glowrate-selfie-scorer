import React from 'react';

// Mock AppRouter type for now
interface AppRouter {
  glow: {
    processSelfie: {
      mutate: (input: { imageUri?: string; imageBase64?: string }) => Promise<any>;
    };
  };
}

// Mock implementation that returns scored data without network calls
const mockProcessSelfie = async (input: { imageUri?: string; imageBase64?: string }) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const baseScore = Math.random() * 3 + 6.5;
  const variance = () => (Math.random() - 0.5) * 1.5;
  
  const breakdown = {
    smile: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
    lighting: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
    style: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
    vibe: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
  };
  
  return {
    id: Date.now().toString(),
    score: Math.round(((breakdown.smile + breakdown.lighting + breakdown.style + breakdown.vibe) / 4) * 10) / 10,
    breakdown,
    tips: [
      { id: '1', category: 'lighting', text: 'Try natural window light for a softer glow!', emoji: '💡' },
      { id: '2', category: 'pose', text: 'Tilt your chin slightly for a defined look!', emoji: '📐' },
      { id: '3', category: 'expression', text: 'Your smile is your superpower!', emoji: '😊' },
    ],
    roast: "You're giving main character energy! 🌟",
    createdAt: new Date().toISOString(),
  };
};

// Simple mock service that mimics tRPC useMutation
export const trpc = {
  glow: {
    processSelfie: {
      useMutation: () => {
        const [state, setState] = React.useState({
          isLoading: false,
          error: null as Error | null,
          data: null as any,
        });

        const mutate = React.useCallback(async (input: { imageUri?: string; imageBase64?: string }) => {
          setState(prev => ({ ...prev, isLoading: true, error: null }));
          try {
            const result = await mockProcessSelfie(input);
            setState({ isLoading: false, error: null, data: result });
            return result;
          } catch (err) {
            const error = err as Error;
            setState({ isLoading: false, error, data: null });
            throw error;
          }
        }, []);

        const mutateAsync = React.useCallback(async (input: { imageUri?: string; imageBase64?: string }) => {
          return await mockProcessSelfie(input);
        }, []);

        return {
          mutate,
          mutateAsync,
          isLoading: state.isLoading,
          error: state.error,
          data: state.data,
          reset: () => setState({ isLoading: false, error: null, data: null }),
        };
      },
    },
  },
} as any;

// Mock client for compatibility
export const trpcClient = trpc;
