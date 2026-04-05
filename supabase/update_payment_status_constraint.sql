alter table public.investments
drop constraint if exists investments_payment_status_check;

alter table public.investments
add constraint investments_payment_status_check
check (
  payment_status in ('initiated', 'processing', 'succeeded', 'payment_failed')
);
