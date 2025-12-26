Write-Host "▶️  Lanciando Stripe CLI: checkout.session.completed..."
stripe trigger checkout.session.completed
Start-Sleep -Seconds 2

Write-Host "`n▶️  Lanciando Stripe CLI: customer.subscription.deleted..."
stripe trigger customer.subscription.deleted
Start-Sleep -Seconds 2

Write-Host "`n✅ Test Stripe completati. Controlla Supabase, email e dashboard Stripe."