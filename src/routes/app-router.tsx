import { DesignSystemLayout } from '@/components/layout/design-layout'
import { ColorsPage } from '@/pages/design-system/colors'
import { ComponentsPage } from '@/pages/design-system/components'
import { DataTablePage } from '@/pages/design-system/data-table'
import { FormsPage } from '@/pages/design-system/forms'
import { ForgotPassword } from '@/pages/forgot-password'
import Login from '@/pages/login'
import { ResetPassword } from '@/pages/reset-password'
import { SignUp } from '@/pages/sign-up'
import { Sandbox } from '@/pages/sandbox'
import { Routes, Route } from 'react-router-dom'

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
			<Route path="/login" element={<Login />} />
			<Route path="/sign-up" element={<SignUp />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/reset-password" element={<ResetPassword />} />

		</Routes>
	)
}