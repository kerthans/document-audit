export default function Testimonials() {
    const testimonials = [
      {
        content: "使用这个系统后，我们的文档审核效率提升了300%，错误率大大降低。",
        author: "张经理",
        role: "某大型企业法务主管"
      },
      {
        content: "智能化的审核系统帮助我们节省了大量人力成本，值得推荐。",
        author: "李总监",
        role: "金融机构合规负责人"
      },
      {
        content: "系统操作简单，报告生成迅速，大大提高了我们的工作效率。",
        author: "王工",
        role: "技术部门主管"
      }
    ];
  
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              客户反馈
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              用户真实评价
            </p>
          </div>
  
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-8 shadow-lg">
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                  <div className="mt-6">
                    <p className="text-gray-900 font-medium">{testimonial.author}</p>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }