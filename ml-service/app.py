from flask import Flask, request, jsonify
import math
import random

app = Flask(__name__)

# Native pure Python K-Means clustering implementation as a bulletproof fallback
def custom_kmeans(data, k, max_iters=100):
    """
    Pure Python K-Means clustering.
    data: list of lists [totalSpend, purchaseCount]
    """
    if not data:
        return []
    
    # 1. Initialize centroids randomly from points
    centroids = random.sample(data, min(k, len(data)))
    while len(centroids) < k:
        centroids.append([0.0, 0.0]) # Padding if fewer data points than k

    assignments = [0] * len(data)
    
    for _ in range(max_iters):
        # 2. Assign each point to the nearest centroid
        changed = False
        for i, point in enumerate(data):
            min_dist = float('inf')
            best_cluster = 0
            for cluster_idx, centroid in enumerate(centroids):
                dist = math.sqrt((point[0] - centroid[0])**2 + (point[1] - centroid[1])**2)
                if dist < min_dist:
                    min_dist = dist
                    best_cluster = cluster_idx
            
            if assignments[i] != best_cluster:
                assignments[i] = best_cluster
                changed = True
        
        # If no assignments changed, we are done
        if not changed:
            break
            
        # 3. Recalculate centroids
        cluster_sums = [[0.0, 0.0] for _ in range(k)]
        cluster_counts = [0] * k
        
        for i, cluster_idx in enumerate(assignments):
            cluster_sums[cluster_idx][0] += data[i][0]
            cluster_sums[cluster_idx][1] += data[i][1]
            cluster_counts[cluster_idx] += 1
            
        for c in range(k):
            if cluster_counts[c] > 0:
                centroids[c] = [
                    cluster_sums[c][0] / cluster_counts[c],
                    cluster_sums[c][1] / cluster_counts[c]
                ]
                
    return assignments, centroids

@app.route('/ml/segment', methods=['POST'])
def segment_customers():
    """
    Receives list of Customer objects:
    [
      { "id": "1", "totalSpend": 22400.0, "purchaseCount": 18, "productCategories": [...] },
      ...
    ]
    Returns mapping of: { "customer_id": "segment_label" }
    """
    try:
        customers = request.json
        if not customers:
            return jsonify({"error": "No customer data received"}), 400

        # Extract features for K-Means (totalSpend and purchaseCount)
        # We normalize to prevent totalSpend scale from dominating purchaseCount
        raw_features = []
        cust_ids = []
        for c in customers:
            spend = float(c.get('totalSpend', 0.0))
            count = float(c.get('purchaseCount', 0.0))
            raw_features.append([spend, count])
            cust_ids.append(c.get('id'))

        if not raw_features:
            return jsonify({"error": "Failed to parse features"}), 400

        # Normalization (Min-Max)
        spends = [f[0] for f in raw_features]
        counts = [f[1] for f in raw_features]
        
        min_spend, max_spend = min(spends), max(spends)
        min_count, max_count = min(counts), max(counts)
        
        span_spend = (max_spend - min_spend) if (max_spend - min_spend) > 0 else 1.0
        span_count = (max_count - min_count) if (max_count - min_count) > 0 else 1.0

        normalized_features = []
        for f in raw_features:
            norm_spend = (f[0] - min_spend) / span_spend
            norm_count = (f[1] - min_count) / span_count
            normalized_features.append([norm_spend, norm_count])

        # Run clustering
        k_clusters = 5
        assignments, centroids = custom_kmeans(normalized_features, k_clusters)

        # Map cluster labels to meaningful Segment Names based on centroid averages
        # High centroid values = High value loyal, Low centroid values = Dormant/New
        centroid_values = []
        for c in range(k_clusters):
            # Calculate average unnormalized spend and count for this cluster
            c_points = [raw_features[i] for i, ass in enumerate(assignments) if ass == c]
            if c_points:
                avg_sp = sum(p[0] for p in c_points) / len(c_points)
                avg_co = sum(p[1] for p in c_points) / len(c_points)
            else:
                avg_sp, avg_co = 0.0, 0.0
            centroid_values.append((c, avg_sp, avg_co))

        # Sort clusters by spend and count to assign labels dynamically
        sorted_centroids = sorted(centroid_values, key=lambda x: (x[1] * 0.7 + x[2] * 0.3), reverse=True)
        
        cluster_to_label = {}
        labels = [
            "High value loyal",    # Highest spend & frequency
            "Regular buyers",      # Good spend & frequency
            "New customers",       # Low frequency but moderate spend
            "At-risk customers",   # Falling frequency
            "Dormant"              # Lowest spend & frequency
        ]

        # In case k is different or smaller
        for rank, item in enumerate(sorted_centroids):
            c_idx = item[0]
            if rank < len(labels):
                cluster_to_label[c_idx] = labels[rank]
            else:
                cluster_to_label[c_idx] = "At-risk customers"

        # Construct final mapping response
        result = {}
        for i, cust_id in enumerate(cust_ids):
            cluster_assigned = assignments[i]
            label = cluster_to_label.get(cluster_assigned, "Regular buyers")
            result[cust_id] = label

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "retailiq-ml"}), 200

if __name__ == '__main__':
    # Run Flask App
    app.run(host='0.0.0.0', port=5000, debug=True)
