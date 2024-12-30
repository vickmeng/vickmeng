import './index.less';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio/react';
import { initLoadingProgressStore } from '@/stores';
const InitLoading = () => {
  const { progress, message } = useSnapshot(initLoadingProgressStore);

  const loading = useMemo(() => progress < 100, [progress]);

  const strokeDashoffset = useMemo(() => {
    const circumference = 2 * Math.PI * 145;

    return ((100 - progress) / 100) * circumference;
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      console.log('完成初始化加载');
    }
  }, [progress]);

  return (
    <div className={`initLoading ${loading ? 'loading' : 'loading-finished'}`}>
      <svg width="300" height="300">
        <circle cx="150" cy="150" r="145" stroke="gray" strokeWidth="1" fill="none" />
        <circle
          cx="150"
          cy="150"
          r="145"
          stroke="#6be6e0"
          strokeWidth="1"
          fill="none"
          strokeDasharray="911 911"
          strokeDashoffset={strokeDashoffset}
        />
        <text x="150" y="140" textAnchor="middle" dominantBaseline="middle" fill="#6be6e0">
          {progress}%
        </text>

        <text x="150" y="168" textAnchor="middle" dominantBaseline="middle" fill="#6be6e0">
          {message}...
        </text>
      </svg>
    </div>
  );
};
export default InitLoading;
