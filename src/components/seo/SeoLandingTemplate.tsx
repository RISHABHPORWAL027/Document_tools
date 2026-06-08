import { Download, CheckCircle2, Sparkles } from "lucide-react";
import FaqSection from "./FaqSection";
import RelatedDocuments from "./RelatedDocuments";
import type { SeoDocument } from "@/data/seoDocuments";
import { inAppHref } from "@/data/seoDocuments";
import GeneratorCta from "./GeneratorCta";

interface SeoLandingTemplateProps {
  doc: SeoDocument;
}

export default function SeoLandingTemplate({ doc }: SeoLandingTemplateProps) {
  return (
    <div className="min-h-screen bg-white selection:bg-[#1A2E7E] selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-mesh-gradient-1">
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md mb-6">
                <Sparkles className="w-4 h-4 text-[#1A2E7E]" />
                <span className="text-sm font-medium text-zinc-800">ComplianceDraft {doc.type.toUpperCase()}</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
                {doc.documentName} <br />
                <span className="text-[#1A2E7E] bg-clip-text text-transparent bg-gradient-to-r from-[#1A2E7E] to-blue-600">
                  {doc.type === 'format' ? 'Format' : doc.type === 'pdf' ? 'PDF Download' : doc.type === 'word' ? 'Word Format' : doc.type === 'sample' ? 'Sample' : 'Guide'}
                </span>
              </h1>
              <p className="text-xl text-zinc-700 leading-relaxed mb-10 max-w-lg">
                {doc.intro}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 relative z-50 pointer-events-auto">
                <GeneratorCta
                  href={doc.generatorUrl}
                  label={`Generate ${doc.documentName} Instantly`}
                />
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-sm font-medium text-zinc-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Instant Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{doc.trustBadge ?? "MCA Compliant"}</span>
                </div>
              </div>
            </div>

            {/* Document Preview Graphic */}
            <div className="lg:w-1/2 w-full max-w-md lg:max-w-full perspective-1000">
              <div className="glass-panel p-6 rounded-3xl shadow-2xl transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform hover:rotate-0 duration-500 pointer-events-none">
                <div className="w-full aspect-[1/1.4] bg-white rounded-xl shadow-inner border border-zinc-100 overflow-hidden relative">
                  {/* Fake Document Content */}
                  <div className="p-8 pb-0 h-full w-full flex flex-col gap-4">
                    <div className="w-full h-12 bg-zinc-100 rounded animate-pulse-soft"></div>
                    <div className="w-3/4 h-6 bg-zinc-100 rounded"></div>
                    <div className="space-y-2 mt-4">
                      <div className="w-full h-4 bg-zinc-100 rounded"></div>
                      <div className="w-full h-4 bg-zinc-100 rounded"></div>
                      <div className="w-5/6 h-4 bg-zinc-100 rounded"></div>
                      <div className="w-full h-4 bg-zinc-100 rounded"></div>
                    </div>
                    <div className="space-y-2 mt-6">
                      <div className="w-1/3 h-4 bg-zinc-200 rounded"></div>
                      <div className="w-full h-10 border border-zinc-200 rounded-lg"></div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="w-1/3 h-4 bg-zinc-200 rounded"></div>
                      <div className="w-full h-10 border border-zinc-200 rounded-lg"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4 pb-4">
                    <a
                      href={inAppHref(doc.generatorUrl)}
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-[#1A2E7E] bg-white border border-zinc-200 shadow-lg rounded-full hover:bg-zinc-50 transition-all hover:scale-105"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      View Full Document
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Content Section (What, When, Who, How) */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg prose-zinc max-w-none">
            
            <div className="grid sm:grid-cols-2 gap-12 mb-16">
              <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 transition-all hover:shadow-md">
                <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#1A2E7E]/10 text-[#1A2E7E] flex items-center justify-center text-sm">1</span>
                  What is it?
                </h3>
                <p className="text-zinc-600 m-0">{doc.whatIsIt}</p>
              </div>

              <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 transition-all hover:shadow-md">
                <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#1A2E7E]/10 text-[#1A2E7E] flex items-center justify-center text-sm">2</span>
                  When is it required?
                </h3>
                <p className="text-zinc-600 m-0">{doc.whenIsItRequired}</p>
              </div>
            </div>

            <div className="bg-[#1A2E7E] text-white p-10 rounded-3xl shadow-xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mb-16">
              <h2 className="text-2xl font-bold mb-4 text-white">Who needs {doc.documentName}?</h2>
              <p className="text-white/80 text-lg mb-0">{doc.whoNeedsIt}</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-6">How to use this format?</h2>
              <div className="flex gap-4 p-6 border border-zinc-200 rounded-2xl">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-6 h-6 text-[#1A2E7E]" />
                </div>
                <p className="text-zinc-700 m-0 text-lg">{doc.howToUse}</p>
              </div>
            </div>

            {doc.sections?.map((section) => (
              <div key={section.heading} className="mt-16">
                <h2 className="text-2xl font-bold text-zinc-900 mb-5">{section.heading}</h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i} className="text-zinc-600 text-lg leading-relaxed m-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {doc.example && (
              <div className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-4">{doc.example.title}</h2>
                <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-700 leading-relaxed m-0">
                  {doc.example.body}
                </pre>
              </div>
            )}

            {doc.checklist && doc.checklist.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-zinc-900 mb-5">Quick checklist</h2>
                <ul className="space-y-3 m-0 p-0 list-none">
                  {doc.checklist.map((item) => (
                    <li key={item} className="flex gap-3 text-zinc-700 text-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection faqs={doc.faqs} />

      {/* Final CTA */}
      <section className="py-20 bg-mesh-gradient-2 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-6">
            Ready to prepare your <span className="text-[#1A2E7E]">{doc.documentName}</span>?
          </h2>
          <p className="text-lg text-zinc-700 mb-10 max-w-2xl mx-auto">
            Skip the manual drafting. Use our smart generator to create an error-free, perfectly formatted document in minutes.
          </p>
          <div className="relative z-50 mt-10">
            <GeneratorCta
              href={doc.generatorUrl}
              label="Generate Document Now"
              large
              arrow="arrow"
            />
          </div>
        </div>
      </section>

      {/* Related Documents */}
      <RelatedDocuments relatedDocs={doc.relatedDocs} currentDocumentName={doc.documentName} />
      
    </div>
  );
}
