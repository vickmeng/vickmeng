import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    import('./core');
  }, []);

  return <div></div>;
}
