import React from 'react'

export default function page() {
    return (
        <div class="sidebar-content ">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Violent Crime</h3>
            </div>

            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim.
            </p>

            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <canvas id="barChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <canvas id="scatterPlot"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <p class="text-muted">*Preliminary under review data*</p>
        </div>
    )
}
