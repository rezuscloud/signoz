package coretypes

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestResourceRefSerializesNameField(t *testing.T) {
	ref := ResourceRef{
		Type: MustNewType("role"),
		Kind: MustNewKind("role"),
	}

	data, err := json.Marshal(ref)
	require.NoError(t, err)

	var parsed map[string]string
	err = json.Unmarshal(data, &parsed)
	require.NoError(t, err)

	require.Equal(t, "role", parsed["type"])
	require.Equal(t, "role", parsed["name"])
	_, hasKind := parsed["kind"]
	require.False(t, hasKind, "ResourceRef should serialize as 'name', not 'kind'")
}

func TestResourceRefDeserializesNameField(t *testing.T) {
	input := `{"type":"role","name":"role"}`

	var ref ResourceRef
	err := json.Unmarshal([]byte(input), &ref)
	require.NoError(t, err)

	require.Equal(t, "role", ref.Type.StringValue())
	require.Equal(t, "role", ref.Kind.String())
}

func TestResourceRefRoundTrip(t *testing.T) {
	original := ResourceRef{
		Type: MustNewType("role"),
		Kind: MustNewKind("role"),
	}

	data, err := json.Marshal(original)
	require.NoError(t, err)

	var restored ResourceRef
	err = json.Unmarshal(data, &restored)
	require.NoError(t, err)

	require.Equal(t, original.Type, restored.Type)
	require.Equal(t, original.Kind, restored.Kind)
}

func TestObjectDeserializesNameFieldInResource(t *testing.T) {
	input := `{"resource":{"type":"role","name":"role"},"selector":"signoz-admin"}`

	var obj Object
	err := json.Unmarshal([]byte(input), &obj)
	require.NoError(t, err)

	require.Equal(t, "role", obj.Resource.Type.StringValue())
	require.Equal(t, "role", obj.Resource.Kind.String())
	require.Equal(t, "signoz-admin", obj.Selector.String())
}

func TestObjectRoundTripWithResource(t *testing.T) {
	obj := MustNewObject(
		ResourceRef{Type: MustNewType("role"), Kind: MustNewKind("role")},
		"signoz-admin",
	)

	data, err := json.Marshal(obj)
	require.NoError(t, err)

	var raw map[string]any
	err = json.Unmarshal(data, &raw)
	require.NoError(t, err)

	resource := raw["resource"].(map[string]any)
	require.Equal(t, "role", resource["type"])
	require.Equal(t, "role", resource["name"])
	_, hasKind := resource["kind"]
	require.False(t, hasKind)
}
