export function injectAdminModals() {
  if (!document.getElementById('createPoolModal')) {
    const modalHTML = `
      <div class="modal fade" id="createPoolModal" tabindex="-1" aria-labelledby="createPoolModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden" style="background: var(--fv-card-bg); color: var(--fv-text);">
            <div class="modal-header border-bottom px-4 py-3" style="background: linear-gradient(135deg, #0F5132 0%, #16A34A 100%); color: #FFFFFF;">
              <h5 class="modal-title font-serif fw-bold" id="createPoolModalLabel">
                <i class="fas fa-plus-circle me-2"></i>Create New Agricultural Pool
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="createPoolForm">
              <div class="modal-body p-4">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Pool Title *</label>
                    <input type="text" class="form-control rounded-3" id="poolTitle" placeholder="e.g., Hydroponic Blueberry Farm" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Category *</label>
                    <select class="form-select rounded-3" id="poolCategory" required>
                      <option value="Horticulture">Horticulture</option>
                      <option value="Row Crops">Row Crops</option>
                      <option value="Livestock">Livestock</option>
                      <option value="Permanent Crops">Permanent Crops</option>
                      <option value="Aquaculture">Aquaculture</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Target Annual ROI (%) *</label>
                    <input type="number" step="0.1" class="form-control rounded-3 font-mono" id="poolRoi" placeholder="18.5" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Target Capital ($) *</label>
                    <input type="number" class="form-control rounded-3 font-mono" id="poolTarget" placeholder="750000" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Duration (Months) *</label>
                    <input type="number" class="form-control rounded-3 font-mono" id="poolDuration" value="12" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Risk Tier *</label>
                    <select class="form-select rounded-3" id="poolRisk">
                      <option value="Low Risk">Low Risk (Insured)</option>
                      <option value="Moderate Risk" selected>Moderate Risk</option>
                      <option value="High Yield">High Yield</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Description / Highlights</label>
                    <textarea class="form-control rounded-3" id="poolDesc" rows="3" placeholder="Specify farm location, insurance coverage, and crop harvest expectations..."></textarea>
                  </div>
                </div>
              </div>
              <div class="modal-footer border-top px-4 py-3">
                <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-success rounded-pill px-4 font-weight-bold shadow-sm">
                  <i class="fas fa-check me-1"></i> Launch Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  if (!document.getElementById('editPoolModal')) {
    const editModalHTML = `
      <div class="modal fade" id="editPoolModal" tabindex="-1" aria-labelledby="editPoolModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden" style="background: var(--fv-card-bg); color: var(--fv-text);">
            <div class="modal-header border-bottom px-4 py-3" style="background: linear-gradient(135deg, #0F5132 0%, #16A34A 100%); color: #FFFFFF;">
              <h5 class="modal-title font-serif fw-bold" id="editPoolModalLabel">
                <i class="fas fa-pen-to-square me-2"></i>Edit Agricultural Farm Pool
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="editPoolForm">
              <div class="modal-body p-4">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Pool Title *</label>
                    <input type="text" class="form-control rounded-3" id="editPoolTitle" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Category *</label>
                    <select class="form-select rounded-3" id="editPoolCategory" required>
                      <option value="Horticulture">Horticulture</option>
                      <option value="Row Crops">Row Crops</option>
                      <option value="Livestock">Livestock</option>
                      <option value="Permanent Crops">Permanent Crops</option>
                      <option value="Aquaculture">Aquaculture</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Target Annual ROI (%) *</label>
                    <input type="number" step="0.1" class="form-control rounded-3 font-mono" id="editPoolRoi" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Raised / Target Capital ($) *</label>
                    <input type="text" class="form-control rounded-3 font-mono" id="editPoolRaisedTarget" placeholder="$680K / $800K" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Status *</label>
                    <select class="form-select rounded-3" id="editPoolStatus" required>
                      <option value="Funding">Funding</option>
                      <option value="Active">Active</option>
                      <option value="Matured">Matured</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold text-xs text-uppercase text-muted">Investors Count</label>
                    <input type="number" class="form-control rounded-3 font-mono" id="editPoolInvestors" required />
                  </div>
                </div>
              </div>
              <div class="modal-footer border-top px-4 py-3">
                <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-success rounded-pill px-4 font-weight-bold shadow-sm">
                  <i class="fas fa-check me-1"></i> Save Pool Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', editModalHTML);
  }
}
