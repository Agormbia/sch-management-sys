import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
	{
		title: "MENU",
		items: [
			{
				icon: "/home.png",
				label: "Home",
				href: "/admin",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/teacher.png",
				label: "Teachers",
				href: "/list/teachers",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/student.png",
				label: "Students",
				href: "/list/students",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/subject.png",
				label: "Subjects",
				href: "/list/subjects",
				visible: ["admin"],
			},
			{
				icon: "/class.png",
				label: "Classes",
				href: "/list/classes",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/result.png",
				label: "Results",
				href: "/list/results",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/report.png",
				label: "Generate Report",
				href: "/list/reports",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/calendar.png",
				label: "Events",
				href: "/list/events",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/finance.png",
				label: "Receipts",
				href: "/list/receipts",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/announcement.png",
				label: "Announcements",
				href: "/list/announcements",
				visible: ["admin", "teacher", "student", "parent"],
			},
		],
	},
	{
		title: "OTHER",
		items: [
			{
				icon: "/profile.png",
				label: "Profile",
				href: "/profile",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/setting.png",
				label: "Settings",
				href: "/settings",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/logout.png",
				label: "Logout",
				href: "/logout",
				visible: ["admin", "teacher", "student", "parent"],
			},
		],
	},
];

const Menu = () => {
	return (
		<div className="mt-4 text-sm">
			{menuItems.map((i) => (
				<div className="flex flex-col gap-2" key={i.title}>
					<span className="hidden lg:block text-gray-400 font-light my-4">
						{i.title}
					</span>
					{i.items.map((item) => {
						if (item.visible.includes(role)) {
							return (
								<Link
									href={item.href}
									key={item.label}
									className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
								>
									<Image src={item.icon} alt="" width={20} height={20} />
									<span className="hidden lg:block">{item.label}</span>
								</Link>
							);
						}
					})}
				</div>
			))}
		</div>
	);
};

export default Menu;
