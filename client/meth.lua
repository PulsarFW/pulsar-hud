local config = load(LoadResourceFile(GetCurrentResourceName(), "config/shared.lua"))()

RegisterNUICallback("Meth:Start", function(data, cb)
	plsr.UISounds.Play:FrontEnd(-1, "SELECT", config.SoundSet)
    TriggerEvent("Drugs:Client:Meth:ConfirmCook", data)
	plsr.Hud.Meth:Close()
	cb("ok")
end)

RegisterNUICallback("Meth:Cancel", function(data, cb)
	plsr.UISounds.Play:FrontEnd(-1, "BACK", config.SoundSet)
	plsr.Hud.Meth:Close()
	cb("ok")
end)