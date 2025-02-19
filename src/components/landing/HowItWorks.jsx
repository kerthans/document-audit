export default function HowItWorks() {
    const steps = [
      {
        title: '上传文档',
        description: '支持多种文档格式，包括PDF、Word、Excel等',
        number: '01'
      },
      {
        title: '智能分析',
        description: 'AI系统自动分析文档内容，识别关键信息',
        number: '02'
      },
      {
        title: '问题检测',
        description: '自动检测文档中的潜在问题和风险点',
        number: '03'
      },
      {
        title: '生成报告',
        description: '生成详细的审核报告，包含修改建议',
        number: '04'
      }
    ];
  
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              使用流程
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              四步完成文档审核
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              简单直观的操作流程，让文档审核变得更加轻松
            </p>
          </div>
  
          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-8 md:gap-y-10">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <span className="text-4xl font-bold text-indigo-200">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-xl font-medium text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }