-- Create enterprise_inquiries table
CREATE TABLE IF NOT EXISTS enterprise_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Company information
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  industry_type TEXT NOT NULL,

  -- Optional business details
  annual_travel_budget TEXT,
  number_of_employees TEXT,

  -- Inquiry details
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed'))
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS enterprise_inquiries_created_at_idx ON enterprise_inquiries(created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS enterprise_inquiries_status_idx ON enterprise_inquiries(status);

-- Create index on email for lookups
CREATE INDEX IF NOT EXISTS enterprise_inquiries_email_idx ON enterprise_inquiries(email);

-- Add comment to table
COMMENT ON TABLE enterprise_inquiries IS 'Stores enterprise B2B inquiries from corporate clients';

-- Add RLS (Row Level Security) policies if needed
-- Note: Currently using service role key which bypasses RLS
-- Uncomment below if you want to enable RLS in the future

-- ALTER TABLE enterprise_inquiries ENABLE ROW LEVEL SECURITY;

-- Example policy for authenticated users (admins)
-- CREATE POLICY "Enable read access for authenticated users" ON enterprise_inquiries
--   FOR SELECT USING (auth.role() = 'authenticated');
