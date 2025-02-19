import { useRouter } from 'next/router';
import Button from '../common/Button';

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="bg-indigo-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">准备好开始了吗？</span>
          <span className="block text-indigo-200">立即体验智能文档审核系统</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Button
              onClick={() => router.push('/audit')}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              立即开始
            </Button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Button
              onClick={() => window.location.href = '#features'}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              了解更多
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}