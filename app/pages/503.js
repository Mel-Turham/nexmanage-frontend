// pages/503.js
export default function Custom503() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
        <div className="max-w-xl text-center">
          <Image
            src="/503.svg"
            alt="Erreur 503"
            width={600}
            height={40000}
            priority
            className="h-[65vh] w-full"
          />
          <h1 className="mt-8 text-2xl font-bold text-gray-800">
            Service temporairement indisponible
          </h1>
          <p className="mt-2 text-gray-600">
            Notre service est momentanément indisponible, souvent pour maintenance
            ou surcharge.
          </p>
          <p className="mt-2 text-gray-600">
            Nous faisons notre possible pour rétablir l’accès rapidement.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-3 text-white bg-blue-700 rounded-md hover:bg-blue-800 transition"
          >
            Retour à l’accueil
          </Link>
        </div>
      </div>
  );
}
