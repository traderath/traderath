// Status label + color config for the TradeRath application (light theme).

const BASE = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium';

const PALETTE = {
  slate: 'bg-slate-100 text-slate-600',
  blue: 'bg-blue-50 text-blue-700',
  indigo: 'bg-indigo-50 text-indigo-700',
  sky: 'bg-sky-50 text-sky-700',
  amber: 'bg-amber-50 text-amber-700',
  orange: 'bg-orange-50 text-orange-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
};

const MAP = {
  order: {
    draft: ['Draft', 'slate'],
    confirmed: ['Confirmed', 'blue'],
    processing: ['Processing', 'indigo'],
    ready_to_ship: ['Ready to Ship', 'amber'],
    shipped: ['Shipped', 'sky'],
    completed: ['Completed', 'emerald'],
  },
  shipment: {
    not_started: ['Not started', 'slate'],
    booked: ['Booked', 'blue'],
    in_transit: ['In Transit', 'sky'],
    delivered: ['Delivered', 'emerald'],
    booking_confirmed: ['Booking Confirmed', 'blue'],
    documents_ready: ['Documents Ready', 'indigo'],
    customs_cleared: ['Customs Cleared', 'indigo'],
    departed: ['Departed', 'sky'],
    arrived: ['Arrived', 'sky'],
  },
  payment: {
    unpaid: ['Unpaid', 'slate'],
    partial: ['Partial', 'blue'],
    paid: ['Paid', 'emerald'],
    overdue: ['Overdue', 'red'],
  },
  compliance: {
    pending: ['Pending', 'amber'],
    passed: ['Passed', 'emerald'],
    review: ['Review', 'orange'],
    high_risk: ['High Risk', 'red'],
  },
  risk: {
    low: ['Low', 'emerald'],
    medium: ['Medium', 'amber'],
    high: ['High', 'red'],
  },
  verification: {
    pending: ['Pending', 'amber'],
    verified: ['Verified', 'emerald'],
    rejected: ['Rejected', 'red'],
  },
  docCompliance: {
    pending: ['Pending', 'amber'],
    passed: ['Passed', 'emerald'],
    flag: ['Flagged', 'red'],
  },
  reviewStatus: {
    pending: ['Pending', 'amber'],
    approved: ['Approved', 'emerald'],
    info_requested: ['Info Requested', 'orange'],
    escalated: ['Escalated', 'red'],
  },
  check: {
    passed: ['Passed', 'emerald'],
    review: ['Review', 'amber'],
    failed: ['Failed', 'red'],
  },
};

export function statusInfo(category, value) {
  const entry = (MAP[category] && MAP[category][value]) || ['—', 'slate'];
  return { label: entry[0], color: entry[1] };
}

export function StatusBadge({ category, value, className = '' }) {
  const { label, color } = statusInfo(category, value);
  return <span className={`${BASE} ${PALETTE[color]} ${className}`}>{label}</span>;
}

export const DOC_TYPES = {
  purchase_order: 'Purchase Order',
  proforma_invoice: 'Proforma Invoice',
  commercial_invoice: 'Commercial Invoice',
  packing_list: 'Packing List',
  certificate_of_origin: 'Certificate of Origin',
  shipping_instructions: 'Shipping Instructions',
  bill_of_lading: 'Bill of Lading',
  airway_bill: 'Airway Bill',
  supporting_document: 'Supporting Document',
};

export function docTypeLabel(t) {
  return DOC_TYPES[t] || t || '—';
}
