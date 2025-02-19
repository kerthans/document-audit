import Head from 'next/head';
import Header from '../components/Header';
import UploadSection from '../components/UploadSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Document Audit</title>
        <meta name="description" content="Document Audit Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="container mx-auto px-4 py-8">
        <UploadSection />
      </main>
      <Footer />
    </div>
  );
}