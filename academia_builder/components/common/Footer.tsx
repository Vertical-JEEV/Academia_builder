// create a footer component that will be used in all pages
export default function Footer() {
  return (
    <footer className="bg-gray-100 h-16">
      <div className="h-full px-2">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-xs">
            &copy; 2025 Academia Builder, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}