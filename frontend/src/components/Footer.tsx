import { Link } from "react-router-dom"
// import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-transparent border-t">
            <div className="container mx-auto px-20 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">SCET Hacks</h2>
                        <p className="text-sm text-gray-600">Empowering innovation through collaborative projects.</p>

                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/admin/auth" className="text-gray-600 hover:text-gray-800">Admin</Link></li>
                            <li><Link to="/projects" className="text-gray-600 hover:text-gray-800">Projects</Link></li>
                            <li><Link to="/events" className="text-gray-600 hover:text-gray-800">Events</Link></li>
                            <li><Link to="/about" className="text-gray-600 hover:text-gray-800">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-600 hover:text-gray-800">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li><Link to="/faq" className="text-gray-600 hover:text-gray-800">FAQ</Link></li>
                            <li><Link to="/guidelines" className="text-gray-600 hover:text-gray-800">Contribution Guidelines</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <p className="text-sm text-gray-600 mb-2">Sarvajanik Univeristy</p>
                        <p className="text-sm text-gray-600 mb-2">Dr, R K Desai Marg, Opp. Mission Hospital, Athwalines, Athwa, Surat, Gujarat 395001
                        </p>
                        <p className="text-sm text-gray-600 mb-2">Phone: (0261) 224 0146</p>
                        <p className="text-sm text-gray-600 mb-2">Email: info@scet.ac.in</p>
                        <Link to="https://scet.ac.in/" className="text-blue-600 hover:text-blue-800 text-sm">
                            https://scet.ac.in/
                        </Link>
                    </div>
                </div>
                <div className="mt-8 pt-8  border-gray-200">
                    <p className="text-center text-sm text-gray-600">
                        © {new Date().getFullYear()} SCET Hacks. All rights reserved.
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-800 ml-2">Privacy Policy</Link> |
                        <Link to="/terms" className="text-blue-600 hover:text-blue-800 ml-2">Terms of Service</Link>
                    </p>
                </div>
            </div>
        </footer>
    )
}