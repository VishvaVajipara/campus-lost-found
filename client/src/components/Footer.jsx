function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
        &copy; {new Date().getFullYear()} Campus Lost &amp; Found. Helping students get their belongings back.
      </div>
    </footer>
  );
}

export default Footer;
