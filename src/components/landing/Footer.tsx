import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/LanguageSelector";
import logoGradient from "@/assets/logo-gradient.png";

export const Footer = () => {
  const { t } = useLanguage();

  const footerSections = [
    {
      title: t("footer.product"),
      links: [
        { label: "Features", href: "#features" },
        { label: "Use Cases", href: "#use-cases" },
        { label: t("footer.pricing"), href: "/pricing" },
        { label: t("footer.docs"), href: "/docs" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: t("footer.blog"), href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: t("footer.contact"), href: "/contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "/help" },
        { label: t("footer.support"), href: "/support" },
        { label: "API Documentation", href: "/api" },
        { label: "Status", href: "/status" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: t("footer.privacy"), href: "/privacy" },
        { label: t("footer.terms"), href: "/terms" },
        { label: "Security", href: "/security" },
        { label: "GDPR", href: "/gdpr" }
      ]
    }
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <img src={logoGradient} alt="Tenezis" className="w-8 h-8" />
              <span className="text-xl font-bold text-foreground">Tenezis</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transform your documents into intelligent workspaces with AI-powered analysis and collaboration.
            </p>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Tenezis. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>Made with ❤️ for knowledge workers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};