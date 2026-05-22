'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileText, Download, ChevronRight, Shield, Lock,
  AlertTriangle, Users, CreditCard, Scale, Globe, Mail, Phone
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const SECTIONS_TC = [
  {
    id: 'legal-agreement',
    icon: Scale,
    title: '1. Legal Agreement',
    content: [
      {
        type: 'para',
        text: 'This Terms and Conditions Agreement ("Agreement") is a legally binding contract between:',
      },
      {
        type: 'bullets',
        items: [
          'The operator of this digital marketplace platform ("Platform", "we", "us", "our")',
          'Any individual or entity accessing or using the platform ("User", "Buyer", "Seller")',
        ],
      },
      {
        type: 'para',
        text: 'By accessing, registering, or using this platform, you expressly agree to be bound by this Agreement under the laws of the Republic of Kenya, including but not limited to:',
      },
      {
        type: 'bullets',
        items: [
          'The Law of Contract Act (Cap 23)',
          'The Consumer Protection Act (2012)',
          'The Data Protection Act (2019) and related regulations',
        ],
      },
      { type: 'highlight', text: 'If you do not agree, you must discontinue use immediately.' },
    ],
  },
  {
    id: 'platform-role',
    icon: Globe,
    title: '2. Platform Role and Legal Status',
    content: [
      { type: 'para', text: '2.1 The Platform operates strictly as an intermediary digital marketplace that facilitates interaction between independent Buyers and Sellers.' },
      { type: 'para', text: '2.2 The Platform does NOT:' },
      {
        type: 'bullets',
        items: [
          'Own, manufacture, or sell any listed goods',
          'Act as an agent, distributor, or reseller of products',
          'Guarantee product authenticity, quality, legality, or fitness for purpose',
          'Assume responsibility for contractual obligations between Buyers and Sellers',
        ],
      },
      { type: 'para', text: '2.3 All transactions are strictly and independently executed between Buyers and Sellers.' },
    ],
  },
  {
    id: 'third-party',
    icon: Globe,
    title: '3. Third-Party Services and Integrations',
    content: [
      { type: 'para', text: '3.1 The Platform may integrate or rely on third-party service providers including:' },
      {
        type: 'bullets',
        items: [
          'Payment processors (e.g., mobile money, card gateways)',
          'Logistics and courier services',
          'Cloud hosting providers',
          'Analytics and AI service providers',
          'Communication and notification services',
        ],
      },
      { type: 'para', text: '3.2 Users acknowledge that:' },
      {
        type: 'bullets',
        items: [
          'Third-party services operate under their own terms and privacy policies',
          'The Platform does not control or guarantee third-party performance',
          'The Platform shall not be held liable for any loss, delay, or damage arising from third-party systems',
        ],
      },
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: '4. Payments and Financial Liability Disclaimer',
    content: [
      { type: 'para', text: '4.1 The Platform does NOT directly hold, manage, or guarantee user funds unless explicitly stated under a separate escrow agreement.' },
      { type: 'para', text: '4.2 Payments are processed via independent third-party payment service providers or directly between Users.' },
      { type: 'para', text: '4.3 Accordingly, the Platform shall NOT be held liable for:' },
      {
        type: 'bullets',
        items: [
          'Loss of funds arising from failed or reversed transactions',
          'Fraudulent transactions between Buyers and Sellers',
          'Disputes relating to payment delivery or settlement',
          'Delays caused by payment processors or financial institutions',
        ],
      },
      { type: 'para', text: '4.4 Users acknowledge that all financial transactions are undertaken at their own risk.' },
      { type: 'para', text: '4.5 The Platform may, at its sole discretion, provide dispute mediation support but shall not be obligated to enforce payment recovery or refunds.' },
    ],
  },
  {
    id: 'obligations',
    icon: Users,
    title: '5. User Obligations',
    content: [
      { type: 'subheading', text: '5.1 Sellers' },
      { type: 'para', text: 'Sellers warrant that:' },
      {
        type: 'bullets',
        items: [
          'All listed products are lawful and accurately described',
          'They have legal right to sell the listed goods',
          'Orders will be fulfilled in accordance with agreed terms',
        ],
      },
      { type: 'subheading', text: '5.2 Buyers' },
      { type: 'para', text: 'Buyers warrant that:' },
      {
        type: 'bullets',
        items: [
          'All purchase decisions are made after independent review',
          'Payment details provided are valid and authorized',
          'They will not engage in fraudulent dispute claims',
        ],
      },
    ],
  },
  {
    id: 'disputes',
    icon: Scale,
    title: '6. Dispute Resolution',
    content: [
      { type: 'para', text: '6.1 The Platform may provide voluntary dispute resolution services.' },
      { type: 'para', text: '6.2 The Platform acts strictly as a neutral facilitator and NOT as:' },
      {
        type: 'bullets',
        items: [
          'A court of law',
          'An arbitration body under statutory authority',
          'A guarantor of transaction outcomes',
        ],
      },
      { type: 'para', text: '6.3 Final resolution of disputes may require:' },
      {
        type: 'bullets',
        items: [
          'Mutual agreement between parties',
          'Evidence submission',
          'External legal proceedings under Kenyan law',
        ],
      },
      { type: 'para', text: '6.4 The Platform reserves the right to suspend accounts involved in abuse, fraud, or repeated disputes.' },
    ],
  },
  {
    id: 'liability',
    icon: AlertTriangle,
    title: '7. Limitation of Liability',
    content: [
      { type: 'para', text: 'To the fullest extent permitted under Kenyan law:' },
      { type: 'para', text: '7.1 The Platform shall not be liable for:' },
      {
        type: 'bullets',
        items: [
          'Direct or indirect financial loss',
          'Loss of profits, data, or goodwill',
          'Product defects or misrepresentation by Sellers',
          'Delivery failures or logistics issues',
          'Actions or omissions of Users or third parties',
        ],
      },
      { type: 'highlight', text: '7.2 Use of the Platform is entirely at the User\'s own risk.' },
    ],
  },
  {
    id: 'account-security',
    icon: Lock,
    title: '8. Account Security and Responsibility',
    content: [
      { type: 'para', text: 'Users are solely responsible for:' },
      {
        type: 'bullets',
        items: [
          'Maintaining confidentiality of login credentials',
          'All activity conducted under their account',
          'Prompt notification of unauthorized access',
        ],
      },
      { type: 'para', text: 'The Platform shall not be liable for losses arising from compromised accounts.' },
    ],
  },
  {
    id: 'prohibited',
    icon: AlertTriangle,
    title: '9. Prohibited Activities',
    content: [
      { type: 'para', text: 'Users shall not:' },
      {
        type: 'bullets',
        items: [
          'Engage in fraudulent, deceptive, or illegal activity',
          'Upload or sell prohibited goods under Kenyan law',
          'Attempt to bypass security systems',
          'Scrape, reverse engineer, or disrupt the Platform',
          'Manipulate reviews, ratings, or listings',
        ],
      },
      { type: 'highlight', text: 'Violation may result in immediate suspension or termination.' },
    ],
  },
  {
    id: 'data-protection',
    icon: Shield,
    title: '10. Data Protection and Privacy Compliance',
    content: [
      { type: 'para', text: '10.1 The Platform complies with the Kenya Data Protection Act (2019).' },
      { type: 'para', text: '10.2 Personal data collected may include:' },
      {
        type: 'bullets',
        items: [
          'Identity and contact information',
          'Transaction metadata',
          'Device and usage data',
          'Location data (where permitted)',
        ],
      },
      { type: 'para', text: '10.3 Data may be shared with payment providers, logistics companies, cloud service providers, and analytics or AI service providers.' },
      { type: 'para', text: '10.4 Such third parties are independently responsible for their compliance obligations.' },
    ],
  },
  {
    id: 'data-security',
    icon: Lock,
    title: '11. Data Security',
    content: [
      { type: 'para', text: 'The Platform implements reasonable technical and organizational measures to protect data, including:' },
      {
        type: 'bullets',
        items: [
          'Encryption in transit where applicable',
          'Access control systems',
          'Secure authentication mechanisms',
          'Monitoring for unauthorized access',
        ],
      },
      { type: 'para', text: 'However, absolute security cannot be guaranteed.' },
    ],
  },
  {
    id: 'ip',
    icon: FileText,
    title: '12. Intellectual Property',
    content: [
      { type: 'para', text: 'All Platform software, branding, and system designs remain the intellectual property of the Platform operator unless otherwise stated.' },
      { type: 'para', text: 'Users retain ownership of their uploaded content but grant the Platform a non-exclusive license to display and distribute such content for operational purposes.' },
    ],
  },
  {
    id: 'termination',
    icon: AlertTriangle,
    title: '13. Termination',
    content: [
      { type: 'para', text: 'The Platform reserves the right to suspend or terminate accounts:' },
      {
        type: 'bullets',
        items: [
          'For breach of this Agreement',
          'For fraudulent or illegal activity',
          'To comply with legal obligations',
          'To protect platform integrity',
        ],
      },
    ],
  },
  {
    id: 'amendments',
    icon: FileText,
    title: '14. Amendments',
    content: [
      { type: 'para', text: 'The Platform may update this Agreement periodically. Continued use after updates constitutes acceptance of revised terms.' },
    ],
  },
  {
    id: 'governing-law',
    icon: Scale,
    title: '15. Governing Law',
    content: [
      { type: 'para', text: 'This Agreement shall be governed by and interpreted in accordance with the laws of the Republic of Kenya.' },
      { type: 'highlight', text: 'Any disputes shall be subject to the jurisdiction of Kenyan courts.' },
    ],
  },
]

const SECTIONS_PP = [
  {
    id: 'pp-controller',
    title: '1. Data Controller',
    content: [
      { type: 'para', text: 'The Platform acts as a Data Controller under the Kenya Data Protection Act (2019).' },
    ],
  },
  {
    id: 'pp-collected',
    title: '2. Personal Data Collected',
    content: [
      { type: 'para', text: 'We may collect:' },
      {
        type: 'bullets',
        items: [
          'Full name',
          'Email address',
          'Phone number',
          'Physical address (if provided)',
          'Transaction and order history',
          'Device identifiers and IP address',
          'Cookies and usage analytics',
        ],
      },
    ],
  },
  {
    id: 'pp-purpose',
    title: '3. Purpose of Data Processing',
    content: [
      { type: 'para', text: 'Data is collected for:' },
      {
        type: 'bullets',
        items: [
          'Providing marketplace functionality',
          'Enabling buyer-seller communication',
          'Fraud prevention and security',
          'Analytics and service improvement',
          'Customer support',
          'Legal compliance',
        ],
      },
    ],
  },
  {
    id: 'pp-sharing',
    title: '4. Sharing of Data with Third Parties',
    content: [
      { type: 'para', text: 'We may share data with:' },
      {
        type: 'bullets',
        items: [
          'Payment processors',
          'Logistics providers',
          'Cloud infrastructure providers',
          'Analytics and AI service providers',
        ],
      },
      { type: 'para', text: 'Such sharing is strictly limited to operational necessity.' },
      { type: 'highlight', text: 'The Platform is NOT liable for independent misuse by third parties.' },
    ],
  },
  {
    id: 'pp-rights',
    title: '5. Data Subject Rights',
    content: [
      { type: 'para', text: 'Under Kenyan law, users may:' },
      {
        type: 'bullets',
        items: [
          'Request access to personal data',
          'Request correction of inaccurate data',
          'Request deletion of personal data (subject to legal obligations)',
          'Object to certain processing activities',
        ],
      },
      { type: 'para', text: 'Requests may be submitted via official support channels.' },
    ],
  },
  {
    id: 'pp-retention',
    title: '6. Data Retention',
    content: [
      { type: 'para', text: 'Personal data is retained:' },
      {
        type: 'bullets',
        items: [
          'For as long as necessary for operational purposes',
          'As required under applicable laws',
          'Until account deletion, subject to legal retention obligations',
        ],
      },
    ],
  },
  {
    id: 'pp-cookies',
    title: '7. Cookies',
    content: [
      { type: 'para', text: 'Cookies are used for:' },
      { type: 'bullets', items: ['Authentication', 'Session management', 'Analytics', 'Personalization'] },
      { type: 'para', text: 'Users may disable cookies, though functionality may be affected.' },
    ],
  },
  {
    id: 'pp-security',
    title: '8. Data Security Measures',
    content: [
      { type: 'para', text: 'We implement reasonable safeguards including:' },
      {
        type: 'bullets',
        items: [
          'Secure authentication systems',
          'Encrypted communication channels',
          'Access restrictions',
          'Monitoring systems',
        ],
      },
      { type: 'para', text: 'Despite this, no system is fully secure.' },
    ],
  },
  {
    id: 'pp-international',
    title: '9. International Data Transfers',
    content: [
      { type: 'para', text: 'User data may be processed or stored outside Kenya where third-party infrastructure is used. Such transfers are done with reasonable safeguards.' },
    ],
  },
  {
    id: 'pp-updates',
    title: '10. Policy Updates',
    content: [
      { type: 'para', text: 'This Privacy Policy may be updated from time to time. Continued use of the Platform constitutes acceptance of updates.' },
    ],
  },
  {
    id: 'pp-contact',
    title: '11. Contact',
    content: [
      { type: 'para', text: 'All legal, privacy, or data protection inquiries should be directed through official platform support channels.' },
    ],
  },
]

type Block = { type: string; text?: string; items?: string[] }

function renderBlock(block: Block, i: number) {
  if (block.type === 'para')
    return <p key={i} className="text-gray-600 text-sm leading-relaxed">{block.text}</p>
  if (block.type === 'subheading')
    return <p key={i} className="text-gray-800 text-sm font-bold mt-2">{block.text}</p>
  if (block.type === 'highlight')
    return (
      <div key={i} className="bg-orange-50 border-l-4 border-orange-400 px-4 py-2.5 rounded-r-lg">
        <p className="text-orange-700 text-sm font-semibold">{block.text}</p>
      </div>
    )
  if (block.type === 'bullets')
    return (
      <ul key={i} className="space-y-1.5 pl-1">
        {block.items!.map((item, j) => (
          <li key={j} className="flex items-start gap-2.5 text-gray-600 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
            {item}
          </li>
        ))}
      </ul>
    )
  return null
}

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms')
  const [downloading, setDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const pageW   = doc.internal.pageSize.getWidth()
      const pageH   = doc.internal.pageSize.getHeight()
      const margin  = 18
      const maxW    = pageW - margin * 2
      let y         = margin

      const addPage = () => { doc.addPage(); y = margin }

      const checkY = (needed: number) => { if (y + needed > pageH - margin) addPage() }

      /* ── Header bar ── */
      doc.setFillColor(249, 115, 22)
      doc.rect(0, 0, pageW, 22, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('SOKONI KENYA', margin, 14)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Legal Document — Confidential', pageW - margin, 14, { align: 'right' })
      y = 32

      /* ── Document title ── */
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('TERMS AND CONDITIONS OF USE', margin, y)
      y += 7
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text('Kenya Compliant – Marketplace Platform Agreement', margin, y)
      y += 4
      doc.text(`Effective Date: ${new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y)
      y += 8

      /* ── Divider ── */
      doc.setDrawColor(249, 115, 22)
      doc.setLineWidth(0.5)
      doc.line(margin, y, pageW - margin, y)
      y += 8

      /* ── Helper functions ── */
      const writeHeading = (text: string) => {
        checkY(12)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(249, 115, 22)
        doc.text(text, margin, y)
        y += 6
        doc.setTextColor(30, 30, 30)
      }

      const writePara = (text: string) => {
        const lines = doc.splitTextToSize(text, maxW)
        checkY(lines.length * 5 + 2)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(60, 60, 60)
        doc.text(lines, margin, y)
        y += lines.length * 5 + 2
      }

      const writeBullet = (text: string) => {
        const lines = doc.splitTextToSize(`• ${text}`, maxW - 4)
        checkY(lines.length * 4.5 + 1)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(60, 60, 60)
        doc.text(lines, margin + 4, y)
        y += lines.length * 4.5 + 1
      }

      const writeHighlight = (text: string) => {
        checkY(14)
        doc.setFillColor(255, 247, 237)
        doc.setDrawColor(249, 115, 22)
        doc.setLineWidth(0.4)
        const lines = doc.splitTextToSize(text, maxW - 8)
        const boxH = lines.length * 5 + 6
        doc.rect(margin, y - 4, maxW, boxH, 'FD')
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bolditalic')
        doc.setTextColor(180, 65, 0)
        doc.text(lines, margin + 4, y)
        y += boxH + 2
        doc.setTextColor(30, 30, 30)
      }

      /* ── Render T&C sections ── */
      for (const section of SECTIONS_TC) {
        checkY(14)
        writeHeading(section.title)
        for (const block of section.content) {
          if (block.type === 'para')       writePara(block.text!)
          if (block.type === 'subheading') { doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(30,30,30); checkY(8); doc.text(block.text!, margin, y); y += 5 }
          if (block.type === 'highlight')  writeHighlight(block.text!)
          if (block.type === 'bullets')    block.items!.forEach(writeBullet)
        }
        y += 4
      }

      /* ── Privacy Policy ── */
      doc.addPage()
      y = margin

      doc.setFillColor(249, 115, 22)
      doc.rect(0, 0, pageW, 22, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('SOKONI KENYA', margin, 14)
      y = 32

      doc.setTextColor(30, 30, 30)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('PRIVACY POLICY', margin, y)
      y += 7
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text('Kenya Data Protection Act (2019) Compliant', margin, y)
      y += 8
      doc.setDrawColor(249, 115, 22)
      doc.setLineWidth(0.5)
      doc.line(margin, y, pageW - margin, y)
      y += 8

      for (const section of SECTIONS_PP) {
        checkY(14)
        writeHeading(section.title)
        for (const block of section.content) {
          if (block.type === 'para')      writePara(block.text!)
          if (block.type === 'highlight') writeHighlight(block.text!)
          if (block.type === 'bullets')   block.items!.forEach(writeBullet)
        }
        y += 4
      }

      /* ── Footer on every page ── */
      const totalPages = (doc as any).internal.getNumberOfPages()
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p)
        doc.setFillColor(245, 245, 245)
        doc.rect(0, pageH - 12, pageW, 12, 'F')
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(120, 120, 120)
        doc.text('Sokoni Kenya · sokonikenya@gmail.com · +254 701 059 192 · www.sokonikenya.com', margin, pageH - 5)
        doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 5, { align: 'right' })
      }

      doc.save('Sokoni-Kenya-Terms-and-Conditions.pdf')
    } finally {
      setDownloading(false)
    }
  }

  const activeSections = activeTab === 'terms' ? SECTIONS_TC : SECTIONS_PP

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Navbar />

      {/* ── Page hero ────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 max-w-5xl py-10">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-200">Legal</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-2.5 rounded-xl">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black">Legal Documents</h1>
                  <p className="text-gray-400 text-sm">Sokoni Kenya — Kenya Compliant Legal Framework</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs text-gray-400 flex-wrap pt-1">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                  <Shield className="h-3 w-3 text-green-400" />
                  Kenya Data Protection Act 2019
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                  <Scale className="h-3 w-3 text-orange-400" />
                  Consumer Protection Act 2012
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                  <FileText className="h-3 w-3 text-blue-400" />
                  Law of Contract Act Cap 23
                </span>
              </div>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-black px-6 py-3.5 rounded-xl transition-colors shadow-lg flex-shrink-0 w-full sm:w-auto justify-center"
            >
              <Download className={`h-5 w-5 ${downloading ? 'animate-bounce' : ''}`} />
              {downloading ? 'Generating PDF…' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab navigation ───────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-[57px] z-30 shadow-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'terms'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Terms &amp; Conditions
              </span>
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'privacy'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy Policy
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="container mx-auto px-4 max-w-5xl py-8 flex-1">
        <div className="flex gap-6">

          {/* ── Sidebar TOC (desktop) ───────────────────── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm sticky top-32 overflow-hidden">
              <p className="px-4 py-3 text-xs font-black text-white bg-orange-500 uppercase tracking-wider">
                {activeTab === 'terms' ? 'Contents' : 'Privacy Contents'}
              </p>
              <nav className="py-1 max-h-[60vh] overflow-y-auto">
                {activeSections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block px-4 py-2 text-xs text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors leading-snug"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Document body ───────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Document header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
              <div className="flex items-start gap-4">
                <div className="bg-orange-50 p-3 rounded-xl flex-shrink-0">
                  <FileText className="h-7 w-7 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    {activeTab === 'terms' ? 'Terms and Conditions of Use' : 'Privacy Policy'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTab === 'terms'
                      ? 'Kenya Compliant – Marketplace Platform Agreement'
                      : 'Kenya Data Protection Act (2019) Compliant'}
                  </p>
                  <div className="flex gap-4 mt-3 text-xs text-gray-400 flex-wrap">
                    <span>Effective: {new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="text-green-500 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Currently in effect
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {activeSections.map(section => {
                const Icon = (section as any).icon
                return (
                  <div
                    key={section.id}
                    id={section.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-32"
                  >
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-gray-50">
                      {Icon && (
                        <div className="bg-orange-100 p-1.5 rounded-lg flex-shrink-0">
                          <Icon className="h-4 w-4 text-orange-500" />
                        </div>
                      )}
                      <h3 className="font-black text-gray-900 text-base">{section.title}</h3>
                    </div>
                    <div className="px-5 py-5 space-y-3">
                      {section.content.map((block, i) => renderBlock(block as Block, i))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Contact / Footer card */}
            <div className="mt-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
              <h3 className="font-black text-lg mb-1">Legal Enquiries</h3>
              <p className="text-gray-400 text-sm mb-4">
                For questions about these terms, your data rights, or any legal matter, contact us through:
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: Mail,         label: 'Email',     val: 'sokonikenya@gmail.com',     href: 'mailto:sokonikenya@gmail.com' },
                  { icon: Phone,        label: 'Phone',     val: '+254 701 059 192',          href: 'tel:+254701059192' },
                  { icon: FileText,     label: 'Support',   val: 'Help Center',               href: '/support' },
                ].map(({ icon: I, label, val, href }) => (
                  <a key={label} href={href}
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors px-4 py-3 rounded-lg">
                    <I className="h-4 w-4 text-orange-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-semibold text-white">{val}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Download CTA bottom */}
            <div className="mt-5 bg-orange-50 border border-orange-100 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div>
                <p className="font-black text-gray-900">Save a copy for your records</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Download both Terms &amp; Conditions and Privacy Policy as a single well-formatted PDF document.
                </p>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-black px-6 py-3 rounded-xl transition-colors shadow-sm flex-shrink-0 whitespace-nowrap"
              >
                <Download className={`h-4 w-4 ${downloading ? 'animate-bounce' : ''}`} />
                {downloading ? 'Generating…' : 'Download PDF'}
              </button>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
