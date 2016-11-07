import accountSettingsHtml from "./account-settings-view-tmpl.html";

const accountSettingsComponent = {
	template: accountSettingsHtml
  , controller() {
			this.test = "Testing Account components";
	}
};


export default accountSettingsComponent;
