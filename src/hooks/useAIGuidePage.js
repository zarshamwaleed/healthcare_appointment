import { useEffect } from 'react';
import { useAIGuide } from '../context/AIGuideContext';

/**
 * Custom hook to automatically update the AI Guide context
 * when a page component mounts
 * 
 * Usage in any page component:
 * 
 * import useAIGuidePage from '../hooks/useAIGuidePage';
 * 
 * const MyPage = () => {
 *   useAIGuidePage('pageName');
 *   
 *   return <div>...</div>;
 * };
 */
const useAIGuidePage = (pageName) => {
  const { updateCurrentPage } = useAIGuide();

  useEffect(() => {
    if (pageName) {
      updateCurrentPage(pageName);
    }
  }, [pageName, updateCurrentPage]);
};

export default useAIGuidePage;
