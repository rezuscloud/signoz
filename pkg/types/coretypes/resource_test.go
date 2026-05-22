package coretypes

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestResourceRefSerializesKindField(t *testing.T) {
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
	require.Equal(t, "role", parsed["kind"])
	_, hasName := parsed["name"]
	require.False(t, hasName, "ResourceRef should serialize as 'kind', not 'name'")
}

func TestResourceRefDeserializesKindField(t *testing.T) {
	input := `{"type":"role","kind":"role"}`

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

func TestObjectDeserializesKindFieldInResource(t *testing.T) {
	input := `{"resource":{"type":"role","kind":"role"},"selector":"signoz-admin"}`

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
	require.Equal(t, "role", resource["kind"])
	_, hasName := resource["name"]
	require.False(t, hasName)
}
