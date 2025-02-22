import Head from 'next/head';
import Header from '../components/Header';
import UploadContainer from '../components/audit/UploadContainer';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Head>
        <title>Document Audit</title>
        <meta name="description" content="Smart Document Analysis System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <UploadContainer />
      </main>

      <Footer />
    </div>
  );
}