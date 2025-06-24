import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl">Kahoot Clone</h1>
        <div>
          <Link href="/" className="text-white px-4">
            Home
          </Link>
          <Link href="/quiz" className="text-white px-4">
            Quiz
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
