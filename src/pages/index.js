import Head from 'next/head';
import Layout from '../components/common/Layout';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import CTASection from '../components/landing/CTASection';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Document Audit - 智能文档审核系统</title>
        <meta name="description" content="快速、准确的文档智能审核解决方案" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </Layout>
  );
}