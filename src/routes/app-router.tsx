import { DesignSystemLayout } from '@/components/layout/design-layout'
import { PrivateLayout } from '@/components/layout/private-layout'
import { AuthCallback } from '@/pages/auth-callback'
import { ColorsPage } from '@/pages/design-system/colors'
import { ComponentsPage } from '@/pages/design-system/components'
import { DataTablePage } from '@/pages/design-system/data-table'
import { FormsPage } from '@/pages/design-system/forms'
import { ForgotPassword } from '@/pages/forgot-password'
import { Login } from '@/pages/login'
import { ResetPassword } from '@/pages/reset-password'
import { Sandbox } from '@/pages/sandbox'
import { Services } from '@/pages/services'
import { SignUp } from '@/pages/sign-up'
import { Routes, Route } from 'react-router-dom'
import { GuestGuard } from './guest-guard'
import { Professionals } from '@/pages/professionals'

export function AppRouter() {
	return (
		<Routes>
			<Route path="/design-system" element={<DesignSystemLayout />}>
				<Route path="colors" element={<ColorsPage />} />
				<Route path="components" element={<ComponentsPage />} />
				<Route path="data-table" element={<DataTablePage />} />
				<Route path="forms" element={<FormsPage />} />
			</Route>

			<Route path="/sandbox" element={<Sandbox />} />

			<Route element={<GuestGuard />}>
				<Route path="/login" element={<Login />} />
			</Route>

			<Route path="/sign-up" element={<SignUp />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/reset-password" element={<ResetPassword />} />
			<Route path="/auth/callback" element={<AuthCallback />} />

			<Route path="/app" element={<PrivateLayout />}>
				<Route index element={<h1>App Home</h1>} />
				<Route path="services" element={<Services />} />
				<Route path="professionals" element={<Professionals />} />
				{/* <Route path="customers" element={<Customers />} /> */}
			</Route>
		</Routes>
	)
}