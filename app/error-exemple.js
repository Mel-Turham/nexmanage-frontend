'use client';

import React from 'react';

export default function Error({ error, reset }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Oups ! Une erreur est survenue</h1>
        <p style={styles.message}>
          {error?.message || "Désolé, quelque chose s'est mal passé."}
        </p>
        <button style={styles.button} onClick={() => reset()}>
          Réessayer
        </button>
      </div>
      <footer style={styles.footer}>
        <small>© {new Date().getFullYear()} Mon Application</small>
      </footer>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '3rem 4rem',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    maxWidth: '480px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    fontWeight: '700',
    textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    lineHeight: '1.5',
    textShadow: '0.5px 0.5px 2px rgba(0,0,0,0.2)',
  },
  button: {
    backgroundColor: '#fff',
    color: '#764ba2',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.4)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  footer: {
    marginTop: 'auto',
    padding: '1rem',
    fontSize: '0.9rem',
    opacity: 0.7,
  },
};
