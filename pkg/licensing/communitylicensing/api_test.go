package communitylicensing

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/SigNoz/signoz/pkg/types/licensetypes"
	"github.com/SigNoz/signoz/pkg/valuer"
	"github.com/stretchr/testify/require"
)

func TestGetActiveReturns501(t *testing.T) {
	api := NewLicenseAPI()
	req := httptest.NewRequest(http.MethodGet, "/api/v3/licenses/active", nil)
	rw := httptest.NewRecorder()

	api.GetActive(rw, req)

	resp := rw.Result()
	defer resp.Body.Close()

	require.Equal(t, http.StatusNotImplemented, resp.StatusCode)

	var body struct {
		Status string `json:"status"`
		Error  struct {
			Code    string `json:"code"`
			Message string `json:"message"`
		} `json:"error"`
	}
	err := json.NewDecoder(resp.Body).Decode(&body)
	require.NoError(t, err)
	require.Equal(t, "error", body.Status)
	require.Equal(t, "licensing_unsupported", body.Error.Code)
}

func TestActivateReturns501(t *testing.T) {
	api := NewLicenseAPI()
	req := httptest.NewRequest(http.MethodPost, "/api/v3/licenses/activate", nil)
	rw := httptest.NewRecorder()

	api.Activate(rw, req)

	resp := rw.Result()
	defer resp.Body.Close()

	require.Equal(t, http.StatusNotImplemented, resp.StatusCode)
}

func TestCheckoutReturnsUnsupported(t *testing.T) {
	api := NewLicenseAPI()
	req := httptest.NewRequest(http.MethodPost, "/api/v3/licenses/checkout", nil)
	rw := httptest.NewRecorder()

	api.Checkout(rw, req)

	resp := rw.Result()
	defer resp.Body.Close()

	require.Equal(t, http.StatusNotImplemented, resp.StatusCode)
}

func TestPortalReturnsUnsupported(t *testing.T) {
	api := NewLicenseAPI()
	req := httptest.NewRequest(http.MethodPost, "/api/v3/licenses/portal", nil)
	rw := httptest.NewRecorder()

	api.Portal(rw, req)

	resp := rw.Result()
	defer resp.Body.Close()

	require.Equal(t, http.StatusNotImplemented, resp.StatusCode)
}

func TestGetFeatureFlagsReturnsAllActive(t *testing.T) {
	provider := &communityLicensing{}

	testOrgID := valuer.MustNewUUID("019e201a-86a6-77c6-8b4e-3ac76732a760")

	features, err := provider.GetFeatureFlags(context.Background(), testOrgID)
	require.NoError(t, err)
	require.NotEmpty(t, features)

	expectedFeatures := []string{
		licensetypes.SSO.StringValue(),
		licensetypes.Onboarding.StringValue(),
		licensetypes.ChatSupport.StringValue(),
		licensetypes.Gateway.StringValue(),
		licensetypes.PremiumSupport.StringValue(),
		licensetypes.AnomalyDetection.StringValue(),
		licensetypes.DotMetricsEnabled.StringValue(),
	}

	for _, expected := range expectedFeatures {
		found := false
		for _, f := range features {
			if f.Name.StringValue() == expected {
				require.True(t, f.Active, "feature %s should be active", expected)
				require.Equal(t, int64(-1), f.UsageLimit, "feature %s should have unlimited usage", expected)
				found = true
				break
			}
		}
		require.True(t, found, "expected feature %s to be present", expected)
	}
}

func TestGetActiveProviderReturnsCommunityLicense(t *testing.T) {
	provider := &communityLicensing{}

	orgID := valuer.MustNewUUID("019e201a-86a6-77c6-8b4e-3ac76732a760")
	license, err := provider.GetActive(context.Background(), orgID)
	require.NoError(t, err)
	require.NotNil(t, license)
	require.Equal(t, "community", license.Key)
	require.Equal(t, licensetypes.PlanNameBasic.StringValue(), license.PlanName.StringValue())
}
