import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Scale, Users, Target, Activity } from "lucide-react";

export default function Government() {
  const criteria = [
    { title: "Legal Entity", desc: "Rigorous compliance checks and local incorporation readiness.", icon: <Shield className="h-6 w-6" /> },
    { title: "Experience", desc: "Demonstrated track record of executing similar scale infrastructure.", icon: <Activity className="h-6 w-6" /> },
    { title: "Financial Strategy", desc: "Robust capital models securing long-term viability.", icon: <Target className="h-6 w-6" /> },
    { title: "Risk Controls", desc: "Comprehensive ESG, currency, and political risk mitigation.", icon: <Scale className="h-6 w-6" /> },
    { title: "Local Impact", desc: "Commitment to local content, job creation, and skills transfer.", icon: <Users className="h-6 w-6" /> },
    { title: "Execution Model", desc: "Clear delivery pathways, supply chains, and O&M planning.", icon: <FileCheck className="h-6 w-6" /> },
  ];

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <section className="bg-secondary py-20 border-b border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
          <Shield className="w-96 h-96" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider mb-6">
              <Shield className="w-3 h-3" />
              Government Portal
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Government Review Center</h1>
            <p className="text-xl text-muted-foreground">
              Zafora Holding partners with sovereign governments to structure, derisk, and deliver national infrastructure agendas. 
              We translate political vision into bankable, executable projects.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-4">Capability Statement</h2>
              <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
                As a premier African infrastructure advisory, Zafora Holding acts as the critical bridge between state requirements and global capital markets. We understand that government projects must balance rapid delivery with long-term fiscal prudence.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Our approach ensures that projects are structured as independent, commercially viable entities capable of attracting DFI (Development Finance Institution) funding and private capital, without overburdening sovereign balance sheets.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">Our Evaluation Framework</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {criteria.map((item, i) => (
                  <div key={i} className="p-6 bg-card border border-border rounded-xl flex gap-4">
                    <div className="mt-1 text-primary bg-primary/10 p-2 rounded-lg h-fit">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-8 sticky top-24 shadow-xl">
              <h3 className="text-2xl font-serif font-bold text-white mb-4">Request Capability Pack</h3>
              <p className="text-muted-foreground mb-8 text-sm">
                Government ministries and sovereign wealth funds can request our full credentials, track record, and compliance documentation.
              </p>
              
              <div className="space-y-4">
                <Button asChild className="w-full py-6 font-bold text-base">
                  <Link href="/submit?type=government">Secure Access Request</Link>
                </Button>
                <div className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-2">
                  <Shield className="w-3 h-3" />
                  Processed via encrypted channel
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}