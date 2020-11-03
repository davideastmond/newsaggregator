export const checkBoxSource = ({
  cbValue,
  cbId,
  cbLabel,
  cbChecked
}) => `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value=${cbValue} id=${cbId} ${cbChecked}>
        <label class="form-check-label" for="defaultCheck1">
          ${cbLabel}
        </label>
      </div>
`
