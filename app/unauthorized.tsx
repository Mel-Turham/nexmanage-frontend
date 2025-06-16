import Image from "next/image";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      <div className="max-w-xl text-center">
        <Image
          src="/401.svg"
          alt="Erreur 401"
          width={600}
          height={40000}
          priority
          className="h-[70vh] w-full"
        />
        <h1 className="mt-8 text-2xl font-bold text-gray-800">
          Accès non autorisé
        </h1>
        <p className="mt-2 text-gray-600">
          Vous devez être connecté pour accéder à cette page
        </p>
        <p className="mt-2 text-gray-600">
          Veuillez vous identifier avec un compte disposant des droits
          nécessaires.
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
