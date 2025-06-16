// pages/404.js
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>404 - Page non trouvée</h1>
      <p>Désolé, la page que vous recherchez n'existe pas.</p>
      <Link href="/">
        <a style={{ color: '#0070f3', textDecoration: 'underline' }}>Retour à l'accueil</a>
      </Link>
    </div>
  );
}
