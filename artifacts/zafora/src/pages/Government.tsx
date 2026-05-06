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
    <div className="flex flex-col pb-24 bg-[#f7f4ef]">
      {/* Header */}
      <section className="pt-24 pb-20 border-b border-[#e5ded3] bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none text-[#173f35]">
          <Shield className="w-96 h-96" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#173f35]/5 text-[#173f35] border border-[#173f35]/20 text-xs font-bold uppercase tracking-wider mb-6">
              <Shield className="w-4 h-4" />
              Government Portal
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#10231f] tracking-tight mb-6">Government Review Center</h1>
            <p className="text-xl text-[#65736f] leading-relaxed">
              Zafora Holding partners with sovereign governments to structure, derisk, and deliver national infrastructure agendas. 
              We translate political vision into bankable, executable projects.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#10231f] tracking-tight mb-6">Capability Statement</h2>
              <div className="prose prose-lg text-[#65736f] max-w-none">
                <p className="leading-relaxed mb-6">
                  As a premier African infrastructure advisory, Zafora Holding acts as the critical bridge between state requirements and global capital markets. We understand that government projects must balance rapid delivery with long-term fiscal prudence.
                </p>
                <p className="leading-relaxed">
                  Our approach ensures that projects are structured as independent, commercially viable entities capable of attracting DFI (Development Finance Institution) funding and private capital, without overburdening sovereign balance sheets.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#10231f] tracking-tight mb-8">Our Evaluation Framework</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {criteria.map((item, i) => (
                  <div key={i} className="p-8 bg-white border border-[#e5ded3] rounded-[24px] shadow-sm flex flex-col gap-4 hover:border-[#173f35]/30 transition-colors">
                    <div className="text-[#173f35] bg-[#f7f4ef] w-12 h-12 flex items-center justify-center rounded-[12px]">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#10231f] mb-2">{item.title}</h3>
                      <p className="text-sm text-[#65736f] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#e5ded3] rounded-[30px] p-8 sticky top-28 shadow-xl">
              <div className="w-12 h-12 bg-[#f7dfd9] text-[#b85c4b] rounded-[12px] flex items-center justify-center mb-6">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#10231f] tracking-tight mb-4">Request Capability Pack</h3>
              <p className="text-[#65736f] mb-8 leading-relaxed">
                Government ministries and sovereign wealth funds can request our full credentials, track record, and compliance documentation.
              </p>
              
              <div className="space-y-4">
                <Button asChild className="w-full h-14 rounded-full bg-[#173f35] text-white font-bold text-base hover:bg-[#173f35]/90">
                  <Link href="/submit?type=government">Secure Access Request</Link>
                </Button>
                <div className="text-xs font-semibold text-[#8a958f] mt-4 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-[#173f35]" />
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
