import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  Check,
  Zap,
  Users,
  Database,
  Shield,
  Headphones,
  ArrowRight,
  Calendar,
  CreditCard
} from "lucide-react";

interface UserData {
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface SubscriptionSettingsProps {
  user: UserData;
  onClose: () => void;
}

export function SubscriptionSettings({ user, onClose }: SubscriptionSettingsProps) {
  const currentUsage = {
    spaces: { used: 8, limit: user.plan === 'free' ? 3 : user.plan === 'pro' ? 50 : 'unlimited' },
    members: { used: 24, limit: user.plan === 'free' ? 5 : user.plan === 'pro' ? 100 : 'unlimited' },
    storage: { used: 2.4, limit: user.plan === 'free' ? 1 : user.plan === 'pro' ? 100 : 'unlimited' },
    aiMessages: { used: 1247, limit: user.plan === 'free' ? 100 : user.plan === 'pro' ? 10000 : 'unlimited' }
  };

  const plans = [
    {
      name: 'Free',
      price: '€0',
      period: '/mois',
      description: 'Parfait pour débuter',
      features: [
        '3 espaces de travail',
        '5 membres par équipe',
        '1 GB de stockage',
        '100 messages IA/mois',
        'Support communautaire'
      ],
      isCurrentPlan: user.plan === 'free',
      recommended: false
    },
    {
      name: 'Pro',
      price: '€19',
      period: '/mois',
      description: 'Pour les équipes en croissance',
      features: [
        '50 espaces de travail',
        '100 membres par équipe', 
        '100 GB de stockage',
        '10,000 messages IA/mois',
        'IA avancée (GPT-4, Claude)',
        'Support prioritaire',
        'Intégrations avancées'
      ],
      isCurrentPlan: user.plan === 'pro',
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 'Sur mesure',
      period: '',
      description: 'Pour les grandes organisations',
      features: [
        'Espaces illimités',
        'Membres illimités',
        'Stockage illimité',
        'Messages IA illimités',
        'Modèles IA personnalisés',
        'Support dédié 24/7',
        'SSO et sécurité avancée',
        'Conformité enterprise'
      ],
      isCurrentPlan: user.plan === 'enterprise',
      recommended: false
    }
  ];

  const getUsagePercentage = (used: number, limit: number | string) => {
    if (typeof limit === 'string') return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const formatLimit = (limit: number | string, unit: string = '') => {
    return typeof limit === 'string' ? limit : `${limit}${unit}`;
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Abonnement & Facturation</h2>
        <p className="text-muted-foreground">
          Gérez votre abonnement et consultez votre utilisation
        </p>
      </div>

      {/* Current Plan Status */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Plan Actuel</CardTitle>
            </div>
            <Badge className={`${user.plan === 'free' ? 'bg-muted text-muted-foreground' : 
              user.plan === 'pro' ? 'bg-gradient-primary text-primary-foreground' :
              'bg-gradient-to-r from-amber-500 to-orange-500 text-white'}`}>
              <Crown className="w-3 h-3 mr-1" />
              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
            </Badge>
          </div>
          {user.plan === 'pro' && (
            <CardDescription>
              Prochaine facturation le 15 janvier 2024 • €19/mois
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Espaces</span>
                <span className="text-foreground">
                  {currentUsage.spaces.used}/{formatLimit(currentUsage.spaces.limit)}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(currentUsage.spaces.used, currentUsage.spaces.limit)} 
                className="h-2" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Membres</span>
                <span className="text-foreground">
                  {currentUsage.members.used}/{formatLimit(currentUsage.members.limit)}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(currentUsage.members.used, currentUsage.members.limit)} 
                className="h-2" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stockage</span>
                <span className="text-foreground">
                  {currentUsage.storage.used}/{formatLimit(currentUsage.storage.limit, ' GB')}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(currentUsage.storage.used, currentUsage.storage.limit)} 
                className="h-2" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Messages IA</span>
                <span className="text-foreground">
                  {currentUsage.aiMessages.used.toLocaleString()}/{formatLimit(currentUsage.aiMessages.limit)}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(currentUsage.aiMessages.used, currentUsage.aiMessages.limit)} 
                className="h-2" 
              />
            </div>
          </div>

          {user.plan === 'pro' && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Méthode de paiement: •••• 4242
                </span>
              </div>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Changer de plan</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.recommended ? 'ring-2 ring-primary' : 'border-border/50'} ${
                plan.isCurrentPlan ? 'bg-gradient-card' : 'bg-background'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-primary-foreground px-3 py-1">
                    Recommandé
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.isCurrentPlan && (
                    <Badge variant="secondary" className="text-xs">
                      Plan actuel
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.isCurrentPlan ? "secondary" : plan.recommended ? "default" : "outline"}
                  disabled={plan.isCurrentPlan}
                >
                  {plan.isCurrentPlan ? "Plan actuel" : 
                   plan.name === 'Enterprise' ? "Contacter les ventes" : "Choisir ce plan"}
                  {!plan.isCurrentPlan && plan.name !== 'Enterprise' && (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      {user.plan !== 'free' && (
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Historique de facturation</CardTitle>
            <CardDescription>
              Vos dernières factures et paiements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: '15 Déc 2024', amount: '€19.00', status: 'Payé', invoice: 'INV-2024-001' },
                { date: '15 Nov 2024', amount: '€19.00', status: 'Payé', invoice: 'INV-2024-002' },
                { date: '15 Oct 2024', amount: '€19.00', status: 'Payé', invoice: 'INV-2024-003' },
              ].map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{invoice.date}</p>
                      <p className="text-xs text-muted-foreground">{invoice.invoice}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-foreground">{invoice.amount}</span>
                    <Badge variant="secondary" className="text-xs">
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}