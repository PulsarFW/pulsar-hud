local config = load(LoadResourceFile(GetCurrentResourceName(), "config/shared.lua"))()

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["pulsar_core"]:RegisterComponent("ListMenu", LISTMENU)
end)

RegisterNetEvent("ListMenu:Client:Test", function()
	plsr.ListMenu:Show({
		main = {
			label = "Test Menu",
			items = {
				{
					label = "Test Input",
					description = "Triggers input HUD option which lets us get input direct from user, NEAT!",
					event = "Input:Client:Test",
				},
				{
					label = "Test Item",
					description = "Test Item Description",
					submenu = "test",
				},
				{
					label = "Test Item Disabled",
					description = "Test Item Disabled Description",
					disabled = true,
				},
			},
		},
		test = {
			label = "Test Sub Menu",
			items = {
				{
					label = "Test Sub Menu Item",
					description = "Test Sub Menu Item Description",
					event = "ListMenu:Client:MenuTest",
				},
			},
		},
	})
end)

RegisterNUICallback("ListMenu:Clicked", function(data, cb)
	plsr.UISounds.Play:FrontEnd(-1, "SELECT", config.SoundSet)
	plsr.ListMenu:Close()
	TriggerEvent(data.event, data.data)
	cb("ok")
end)

RegisterNUICallback("ListMenu:Back", function(data, cb)
	plsr.UISounds.Play:FrontEnd(-1, "BACK", config.SoundSet)
	TriggerEvent("ListMenu:GoBack")
	cb("ok")
end)

RegisterNUICallback("ListMenu:SubMenu", function(data, cb)
	plsr.UISounds.Play:FrontEnd(-1, "CONTINUE", config.SoundSet)
	TriggerEvent("ListMenu:EnterSubMenu", data.submenu)
	cb("ok")
end)

RegisterNUICallback("ListMenu:Close", function(data, cb)
	plsr.UISounds.Play:FrontEnd(-1, "CANCEL", config.SoundSet)
	plsr.ListMenu:Close()
	TriggerEvent("ListMenu:Close")
	cb("ok")
end)

LISTMENU = {
	Show = function(self, menus)
		SetNuiFocus(true, true)
		SendNUIMessage({
			type = "SET_LIST_MENU",
			data = {
				menus = menus,
			},
		})
	end,
	Close = function(self)
		SetNuiFocus(false, false)
		SendNUIMessage({
			type = "CLOSE_LIST_MENU",
		})
	end,
}
