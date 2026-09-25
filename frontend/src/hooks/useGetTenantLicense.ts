import { useAppContext } from 'providers/App/App';
import { LicensePlatform } from 'types/api/licensesV3/getActive';

export const useGetTenantLicense = (): {
	isCloudUser: boolean;
	isEnterpriseSelfHostedUser: boolean;
	isCommunityUser: boolean;
	isCommunityEnterpriseUser: boolean;
} => {
	const { activeLicense, activeLicenseFetchError } = useAppContext();

	// RZ: our community build ships a real license (platform self_hosted,
	// plan basic) because SSO callbacks validate against GetActive. Classify
	// it as the community edition by its plan name so the sidebar badge stays
	// REZUSCLOUD and community routing applies — this lives in the
	// classification (data shape), not the display string, so it survives
	// upstream frontend merges.
	const isRezusCloudCommunityLicense = activeLicense?.plan?.name === 'basic';

	const responsePayload = {
		isCloudUser: activeLicense?.platform === LicensePlatform.CLOUD || false,
		isEnterpriseSelfHostedUser:
			activeLicense?.platform === LicensePlatform.SELF_HOSTED &&
			!isRezusCloudCommunityLicense,
		isCommunityUser: isRezusCloudCommunityLicense,
		isCommunityEnterpriseUser: false,
	};

	if (
		activeLicenseFetchError &&
		activeLicenseFetchError.getHttpStatusCode() === 404
	) {
		responsePayload.isCommunityEnterpriseUser = true;
	}

	if (
		activeLicenseFetchError &&
		activeLicenseFetchError.getHttpStatusCode() === 501
	) {
		responsePayload.isCommunityUser = true;
	}

	return responsePayload;
};
