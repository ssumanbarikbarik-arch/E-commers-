import Link from "next/link";
import { Icons } from "@/components/icons";

export function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-7 w-7" />
              <span className="font-bold text-lg font-headline">Thread Canvas</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              High-end fashion for the modern individual.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-md font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">All Products</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">New Arrivals</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Best Sellers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-md font-semibold mb-3">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Our Story</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-md font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Thread Canvas. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social media icons can be added here */}
            <p>Socials</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
